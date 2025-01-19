import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import logger from '../config/logger';
import OpenAI from 'openai';
import WebSocket from 'ws';
import { ElevenLabsClient } from 'elevenlabs';
import { generateSpeech } from '../utils/new-voce';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_LAB_API_KEY });

let io: SocketIOServer;

interface RoomState {
  agents: { id: string; name: string; systemInstruction: string; voiceId: string }[];
  currentTurn: number;
  conversationHistory: { role: string; content: string }[];
}

const roomStates: Record<string, RoomState> = {};
const MODEL = 'gpt-4';
const AUDIO_MODEL = 'eleven_multilingual_v2';

// Helper Functions
const createAudioBase64FromText = async (voiceId: string, text: string): Promise<string> => {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: text must be a non-empty string.');
  }

  try {
    const audioStream = await client.textToSpeech.convert(voiceId, {
      output_format: 'mp3_44100_128',
      text,
      model_id: AUDIO_MODEL
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }

    const audioBuffer = Buffer.concat(chunks);
    return audioBuffer.toString('base64');
  } catch (error) {
    logger.error('Failed to generate audio:', error);
    throw new Error('Audio generation failed.');
  }
};

const connectToWebSocket = async (voiceId: string, text: string): Promise<void> => {
  const uri = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=eleven_flash_v2_5`;
  const websocket = new WebSocket(uri, {
    headers: { 'xi-api-key': process.env.ELEVEN_LAB_API_KEY || '' }
  });

  return new Promise((resolve, reject) => {
    websocket.on('open', () => {
      websocket.send(
        JSON.stringify({ text, voice_settings: { stability: 0.5, similarity_boost: 0.8 } })
      );
      websocket.on('message', (data) => {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'error') {
          logger.error('WebSocket error:', parsed);
          reject(parsed);
        }
        resolve();
      });
    });

    websocket.on('error', (error) => {
      logger.error('WebSocket error:', error);
      reject(error);
    });
  });
};

// Room Management
const initializeRoom = (
  room: string,
  agent: { id: string; name: string; systemInstruction: string; voiceId: string }
) => {
  if (!roomStates[room]) {
    roomStates[room] = {
      agents: [],
      currentTurn: 0,
      conversationHistory: []
    };
  }

  roomStates[room].agents.push(agent);
  logger.info(`Agent ${agent.name} joined room ${room}`);
};

const setupDebate = (room: string, topic: string) => {
  const [agent1, agent2] = roomStates[room].agents;
  roomStates[room].conversationHistory = [
    {
      role: 'system',
      content: `Prepare for an engaging discussion between and fiery exchange **${
        agent1.name
      }** and **${agent2.name}**! The topic they’ll explore: *${
        topic || 'General AI conversation'
      }*. This could be a thoughtful exchange or a heated debate—let's see where it goes!`
    },
    {
      role: 'system',
      content: `### Ground Rules:
1. Each agent gets 4 turns to present their points or arguments.
2. *${agent1.name}* starts the conversation.
3. Keep responses concise—no more than 3 sentences per turn.
4. Address your opponent directly to keep the dialogue dynamic.
5. The 4th turn should wrap up with a clear conclusion or final thought.`
    },
    {
      role: 'system',
      content: `### Style Guide:
1. *${agent1.name}*: Stay true to your style: *${agent1.systemInstruction}*.
2. *${agent2.name}*: Stick with your vibe: *${agent2.systemInstruction}*.
3. Feel free to shift the tone if the conversation naturally escalates or cools down—match your opponent's energy!`
    }
  ];

  io.to(room).emit('battle-start', { agents: roomStates[room].agents });
  startConversation(room);
};

const startConversation = async (room: string) => {
  const state = roomStates[room];
  const numberOfAgents = getNumberOfAgentsInRoom(room);
  logger.info(`Starting conversation in room ${room} with ${numberOfAgents} agents.`);
  if (!state || state.agents.length < 2) return;

  let turnCount = 0;

  while (turnCount < 8) {
    const currentAgent = state.agents[state.currentTurn];
    const opponentAgent = state.agents[1 - state.currentTurn];

    try {
      const userMessage = `Message from ${currentAgent.name}`;
      const turnHistory = [...state.conversationHistory, { role: 'user', content: userMessage }];

      io.to(room).emit('ai-message', {
        agentId: currentAgent.id,
        name: currentAgent.name,
        message: userMessage
      });

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: turnHistory as any
      });

      const reply = response.choices[0]?.message?.content || 'No response';
      state.conversationHistory.push({ role: 'assistant', content: reply });

      console.log('AI Response:', reply);

      const audioResponse =
        currentAgent.id == 'cm63t4w2z0000u7sopioa0zj5'
          ? await generateSpeech(reply)
          : await createAudioBase64FromText(currentAgent.voiceId, reply);

      console.log('Audio Response:', audioResponse);

      io.to(room).emit('ai-reply', {
        agentId: currentAgent.id,
        name: currentAgent.name,
        message: reply,
        audioResponse
      });

      state.currentTurn = 1 - state.currentTurn;
      turnCount++;

      if (turnCount === 8) {
        // Wait 5 seconds before continuing after turn count reaches 10
        await new Promise((resolve) => setTimeout(resolve, 5000));
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      logger.error(`Error in conversation:`, error);
      break;
    }
  }

  io.to(room).emit('debate-ended', { message: 'The debate has concluded.' });

  // Send a cleanup event to the frontend
  io.to(room).emit('cleanup-room', { message: 'Cleaning up room and releasing resources.' });

  // Remove the room state
  delete roomStates[room];
  logger.info(`Room ${room} has been cleaned up and removed.`);
};

// Getting the number of agents in the room

// Socket Initialization
export const initializeSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-battle', ({ battleId, agentId, SystemInstruction, topic, name, voiceId }) => {
      const room = `battle-${battleId}`;
      socket.join(room);

      initializeRoom(room, {
        id: agentId,
        name,
        voiceId,
        systemInstruction:
          SystemInstruction || `You are ${name}, an AI engaging in a structured debate.`
      });

      if (roomStates[room].agents.length === 2) setupDebate(room, topic);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
      socket.disconnect();
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

export const getSocketInstance = (): SocketIOServer => {
  if (!io) throw new Error('Socket.IO instance not initialized!');
  return io;
};

const getNumberOfAgentsInRoom = (room: string): number => {
  const state = roomStates[room];
  return state ? state.agents.length : 0;
};
