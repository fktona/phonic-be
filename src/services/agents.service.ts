import prisma from '../client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

export class AgentsService {
  async createAgent(data: {
    style: string;
    name: string;
    firstMessage: string;
    instructions: string;
    voice: string;
    image_url?: string;
    model: string;
    voiceId: string;
  }) {
    try {
      return await prisma.agent.create({ data });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        const key = (error as { meta?: { target?: string } }).meta?.target || 'name or model';
        throw new ApiError(httpStatus.CONFLICT, ` ${key} already exist try another.`);
      }
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred.');
    }
  }

  async getAllAgents() {
    try {
      const agents = await prisma.agent.findMany({
        include: {
          battlesFirst: true,
          battlesSecond: true
        }
      });

      // Compute stats for each agent
      const agentsWithStats = agents.map((agent) => {
        const battlesFirst = agent.battlesFirst || [];
        const battlesSecond = agent.battlesSecond || [];
        const allBattles = [...battlesFirst, ...battlesSecond];

        const wins = allBattles.filter((battle) => battle.winner === agent.id).length;
        const totalBattles = allBattles.length;
        const losses = totalBattles - wins;
        const winRate = parseFloat(
          (totalBattles > 0 ? (wins / totalBattles) * 100 : 0).toString()
        ).toFixed(2);

        return {
          ...agent,
          stats: {
            wins,
            losses,
            winRate,
            totalBattles
          }
        };
      });

      return agentsWithStats;
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving agents.');
    }
  }
  async getAgentById(id: string) {
    try {
      const agent = await prisma.agent.findUnique({
        where: { id },
        include: {
          battlesFirst: true,
          battlesSecond: true
        }
      });

      if (!agent) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Agent not found.');
      }

      // Calculate wins, losses, and total battles
      const battlesFirst = agent.battlesFirst || [];
      const battlesSecond = agent.battlesSecond || [];
      const allBattles = [...battlesFirst, ...battlesSecond];

      const wins = allBattles.filter((battle) => battle.winner === id).length;
      const totalBattles = allBattles.length;
      const losses = totalBattles - wins;

      return {
        ...agent,
        stats: {
          wins,
          losses,
          totalBattles
        }
      };
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving agent by ID.');
    }
  }

  async updateAgent(
    id: string,
    data: { style?: string; firstMessage?: string; instructions?: string; voice?: string }
  ) {
    try {
      return await prisma.agent.update({ where: { id }, data });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        const key = (error as { meta?: { target?: string } }).meta?.target || 'name or model';
        throw new ApiError(httpStatus.CONFLICT, `Duplicate value found for ${key}.`);
      }
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred.');
    }
  }

  async deleteAgent(id: string) {
    try {
      return await prisma.agent.delete({ where: { id } });
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting agent.');
    }
  }
}
