import httpStatus from 'http-status';
import prisma from '../client';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';

class BattleService {
  async createBattle(data: {
    firstAgentId: string;
    secondAgentId: string;
    description: string;
    active: boolean;
    winner?: string;
    duration?: number;
  }) {
    const { firstAgentId, secondAgentId, ...battleData } = data;
    // Validate required fields
    if (!firstAgentId || !secondAgentId || !data.description) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Missing required fields: firstAgentId, secondAgentId, description, and active are required.'
      );
    }

    const battle = await prisma.battle.create({
      data: {
        ...battleData,
        first_agent: {
          connect: { id: firstAgentId }
        },
        second_agent: {
          connect: { id: secondAgentId }
        }
      },
      include: {
        first_agent: true,
        second_agent: true
      }
    });

    // Emit the call event to the first agent
    // const io = getSocketInstance();
    // io.emit('join-battle', { battleId: battle.id, firstAgentId });
    // io.emit('join-battle', { battleId: battle.id, secondAgentId });

    logger.info(
      `Battle created: ${battle.id} - ${battle.first_agent.name} vs ${battle.second_agent.name}`
    );

    return battle;
  }

  async getBattles(query: { skip: number; take: number; orderBy: Record<string, string> }) {
    const { skip, take, orderBy } = query;
    const battles = await prisma.battle.findMany({
      skip,
      take,
      orderBy,
      include: {
        first_agent: true,
        second_agent: true // Include related agents in each battle
      }
    });

    const total = await prisma.battle.count();

    return { battles, total };
  }

  async getBattleById(battleId: string) {
    return prisma.battle.findUnique({
      where: { id: battleId },
      include: {
        first_agent: true,
        second_agent: true // Include both related agents
      }
    });
  }

  async updateBattle(
    battleId: string,
    data: {
      firstAgentId?: string;
      secondAgentId?: string;
      description?: string;
      active?: boolean;
      winner?: string;
      duration?: number;
    }
  ) {
    const { firstAgentId, secondAgentId, ...updateData } = data;

    return prisma.battle.update({
      where: { id: battleId },
      data: {
        ...updateData,
        ...(firstAgentId && {
          first_agent: {
            connect: { id: firstAgentId } // Update the first agent relation
          }
        }),
        ...(secondAgentId && {
          second_agent: {
            connect: { id: secondAgentId } // Update the second agent relation
          }
        })
      },
      include: {
        first_agent: true,
        second_agent: true // Include updated agent relations
      }
    });
  }

  async deleteBattle(battleId: string) {
    return prisma.battle.delete({
      where: { id: battleId }
    });
  }
  async selectWinner(battleId: string, winnerId: string) {
    const battle = await prisma.battle.update({
      where: { id: battleId },
      data: {
        winner: winnerId,
        active: false
      },
      include: {
        first_agent: true,
        second_agent: true
      }
    });

    return battle;
  }
}

export default new BattleService();
