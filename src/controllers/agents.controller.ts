import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { AgentsService } from '../services/agents.service';

const agentsService = new AgentsService();

class AgentsController {
  public createAgent = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
    const agent = await agentsService.createAgent(data);
    res.status(201).json(agent);
  });

  public getAllAgents = async (req: Request, res: Response) => {
    const agents = await agentsService.getAllAgents();
    res.status(200).json(agents);
  };

  public getAgentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const agent = await agentsService.getAgentById(id);
    res.status(200).json(agent);
  });

  public updateAgent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const agent = await agentsService.updateAgent(id, data);
    res.status(200).json(agent);
  });

  public deleteAgent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await agentsService.deleteAgent(id);
    res.status(204).end();
  });
}

const agentsController = new AgentsController();
export default agentsController;
