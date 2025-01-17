import express from 'express';
import validate from '../../middlewares/validate';
import agentController from '../../controllers/agents.controller';
import { agentValidation } from '../../validations';

const router = express.Router();

router
  .route('/')
  .post(validate(agentValidation.createAgent), agentController.createAgent)
  .get(validate(agentValidation.getAgents), agentController.getAllAgents);

router
  .route('/:agentId')
  .get(validate(agentValidation.getAgent), agentController.getAgentById)
  .patch(validate(agentValidation.updateAgent), agentController.updateAgent)
  .delete(validate(agentValidation.deleteAgent), agentController.deleteAgent);

export default router;

/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: Public agent management and retrieval
 */

/**
 * @swagger
 * /agents:
 *   post:
 *     summary: Create an agent
 *     description: Anyone can create agents with details like first message, style, and instructions.
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAgent'
 *     responses:
 *       "201":
 *         description: Agent created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *
 *   get:
 *     summary: Get all agents
 *     description: Retrieve a list of all agents.
 *     tags: [Agents]
 *     parameters:
 *       - $ref: '#/components/parameters/QueryParameters'
 *     responses:
 *       "200":
 *         description: A list of agents.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /agents/{id}:
 *   get:
 *     summary: Get an agent
 *     description: Retrieve agent details by ID.
 *     tags: [Agents]
 *     parameters:
 *       - $ref: '#/components/parameters/AgentId'
 *     responses:
 *       "200":
 *         description: Agent details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an agent
 *     description: Anyone can update an agent's details.
 *     tags: [Agents]
 *     parameters:
 *       - $ref: '#/components/parameters/AgentId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAgent'
 *     responses:
 *       "200":
 *         description: Agent updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an agent
 *     description: Anyone can delete an agent by ID.
 *     tags: [Agents]
 *     parameters:
 *       - $ref: '#/components/parameters/AgentId'
 *     responses:
 *       "200":
 *         description: Agent deleted successfully.
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: Public agent management and retrieval
 */

/**
 * @swagger
 * /agents:
 *   post:
 *     summary: Create an agent
 *     description: Anyone can create agents with details like first message, style, and instructions.
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAgent'
 *     responses:
 *       "201":
 *         description: Agent created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *
 *   get:
 *     summary: Get all agents
 *     description: Retrieve a list of all agents.
 *     tags: [Agents]
 *     parameters:
 *       - $ref: '#/components/parameters/QueryParameters'
 *     responses:
 *       "200":
 *         description: A list of agents.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /agents/{id}:
 *   get:
 *     summary: Get an agent
 *     description: Retrieve agent details by ID.
 *     tags: [Agents]
 *     parameters:
 *       - $ref: '#/components/parameters/AgentId'
 *     responses:
 *       "200":
 *         description: Agent details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an agent
 *     description: Anyone can update an agent's details.
 *     tags: [Agents]
 *     parameters:
 *       - $ref: '#/components/parameters/AgentId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAgent'
 *     responses:
 *       "200":
 *         description: Agent updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an agent
 *     description: Anyone can delete an agent by ID.
 *     tags: [Agents]
 *     parameters:
 *       - $ref: '#/components/parameters/AgentId'
 *     responses:
 *       "200":
 *         description: Agent deleted successfully.
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       required:
 *         - id
 *         - firstMessage
 *         - style
 *         - name
 *         - instructions
 *         - voice
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the agent.
 *         firstMessage:
 *           type: string
 *           description: The first message the agent sends.
 *         style:
 *           type: string
 *           description: The style of the agent.
 *         name:
 *           type: string
 *           description: The name of the agent.
 *         instructions:
 *           type: string
 *           description: The instructions for the agent.
 *         voice:
 *           type: string
 *           description: The voice associated with the agent.
 *         battlesFirst:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Battle'
 *           description: List of battles where the agent is the first participant.
 *         battlesSecond:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Battle'
 *           description: List of battles where the agent is the second participant.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the agent was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the agent was last updated.
 *       example:
 *         id: "agent123"
 *         firstMessage: "Hello, how can I assist you?"
 *         style: "Friendly"
 *         name: "AssistantBot"
 *         instructions: "Assist the user in various tasks."
 *         voice: "Alexa"
 *         battlesFirst: []
 *         battlesSecond: []
 *         createdAt: "2025-01-09T00:00:00Z"
 *         updatedAt: "2025-01-09T01:00:00Z"
 *
 *     CreateAgent:
 *       type: object
 *       required:
 *         - firstMessage
 *         - style
 *         - name
 *         - instructions
 *         - voice
 *       properties:
 *         firstMessage:
 *           type: string
 *           description: The first message the agent sends.
 *         style:
 *           type: string
 *           description: The style of the agent.
 *         name:
 *           type: string
 *           description: The name of the agent.
 *         instructions:
 *           type: string
 *           description: The instructions for the agent.
 *         voice:
 *           type: string
 *           description: The voice associated with the agent.
 *       example:
 *         firstMessage: "Hello, how can I help you?"
 *         style: "Polite"
 *         name: "SupportBot"
 *         instructions: "Provide user support."
 *         voice: "Google Assistant"
 *
 *     UpdateAgent:
 *       type: object
 *       properties:
 *         firstMessage:
 *           type: string
 *           description: The first message the agent sends.
 *         style:
 *           type: string
 *           description: The style of the agent.
 *         name:
 *           type: string
 *           description: The name of the agent.
 *         instructions:
 *           type: string
 *           description: The instructions for the agent.
 *         voice:
 *           type: string
 *           description: The voice associated with the agent.
 *       example:
 *         firstMessage: "How can I assist you today?"
 *         style: "Helpful"
 *         name: "HelpBot"
 *         instructions: "Provide technical assistance."
 *         voice: "Siri"
 *   parameters:
 *     AgentId:
 *       in: path
 *       name: agentId
 *       required: true
 *       schema:
 *         type: string
 *       description: The unique ID of the agent.
 *     QueryParameters:
 *       in: query
 *       name: query
 *       schema:
 *         type: string
 *       description: A search query to filter agents.
 *       example: "SupportBot"
 *     NoContent:
 *       description: No content to return.
 *     BadRequest:
 *       description: The request was invalid.
 *     NotFound:
 *       description: The specified resource was not found.
 *     OK:
 *       description: The request was successful.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agent'
 *     Created:
 *       description: The agent was successfully created.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agent'
 */
