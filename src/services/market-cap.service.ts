import axios from 'axios';
import prisma from '../client';

const fetchMarketCap = async (tokenAddress: string): Promise<number | null> => {
  try {
    const tokenData = await prisma.tokenMarketData.findUnique({
      where: { tokenAddress }
    });

    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

    let marketCap: number | null = tokenData?.marketCap || null;

    if (!tokenData || tokenData.lastFetch < twoMinutesAgo) {
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
      );

      marketCap = response.data?.pairs?.[0]?.marketCap;

      if (marketCap) {
        if (tokenData) {
          // Update existing record
          await prisma.tokenMarketData.update({
            where: { tokenAddress },
            data: {
              marketCap: response.data.pairs[0].marketCap,
              lastFetch: now
            }
          });
        } else {
          // Create new record
          await prisma.tokenMarketData.create({
            data: {
              tokenAddress,
              marketCap: response.data.pairs[0].marketCap,
              lastFetch: now
            }
          });
        }
      } else {
        console.error(`Market cap not found for token: ${tokenAddress}`);
      }
    } else {
      console.log(`Skipping fetch for ${tokenAddress}; last fetch was at ${tokenData.lastFetch}`);
    }

    return marketCap;
  } catch (error) {
    console.error(`Error fetching market cap for ${tokenAddress}:`, error);
    throw new Error('Failed to fetch market cap');
  }
};

export default fetchMarketCap;
