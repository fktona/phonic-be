import exp from 'constants';
import { Request, Response } from 'express';
import fetchMarketCap from '../services/market-cap.service';

const marketCapController = async (req: Request, res: Response) => {
  const { tokenAddress } = req.params;

  try {
    const marketCap = await fetchMarketCap(tokenAddress);

    if (marketCap !== null) {
      res.status(200).json({ success: true, marketCap });
    } else {
      res.status(404).json({ success: false, message: 'Market Cap not found' });
    }
  } catch (error) {
    console.error(`Error in marketCapController for ${tokenAddress}:`, error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export default marketCapController;
