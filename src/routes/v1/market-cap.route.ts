import express from 'express';
import marketCapController from '../../controllers/market-cap.controller';

const router = express.Router();

router.route('/:tokenAddress').get(marketCapController);

export default router;

/**
 * @swagger
 * /market-cap/{tokenAddress}:
 *   get:
 *     summary: Get the market cap of a token
 *     description: Retrieve the market cap of a specific token by its address.
 *     tags: [Token]
 *     parameters:
 *       - in: path
 *         name: tokenAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: Token address
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 marketCap:
 *                   type: number
 *       "404":
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
