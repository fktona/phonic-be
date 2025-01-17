import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import { battleService } from '../services';

class BattleController {
  public createBattle = catchAsync(async (req: Request, res: Response) => {
    const battle = await battleService.createBattle(req.body);
    res.status(httpStatus.CREATED).send(battle);
  });

  public getBattles = catchAsync(async (req: Request, res: Response) => {
    const { sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const orderBy = { [sortBy as string]: String(order) };

    const result = await battleService.getBattles({
      skip,
      take,
      orderBy
    });

    res.send({
      battles: result.battles,
      total: result.total,
      page: Number(page),
      limit: Number(limit)
    });
  });

  public getBattle = catchAsync(async (req: Request, res: Response) => {
    const { battleId } = req.params;

    const battle = await battleService.getBattleById(battleId);
    if (!battle) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Battle not found' });
    }

    res.send(battle);
  });

  public updateBattle = catchAsync(async (req: Request, res: Response) => {
    const { battleId } = req.params;

    const battle = await battleService.updateBattle(battleId, req.body);
    res.send(battle);
  });

  public deleteBattle = catchAsync(async (req: Request, res: Response) => {
    const { battleId } = req.params;

    await battleService.deleteBattle(battleId);
    res.status(httpStatus.NO_CONTENT).send();
  });
  public selectWinner = catchAsync(async (req: Request, res: Response) => {
    const { battleId, winnerId } = req.params;

    const battle = await battleService.selectWinner(battleId, winnerId);
    res.send(battle);
  });
}

export default new BattleController();
