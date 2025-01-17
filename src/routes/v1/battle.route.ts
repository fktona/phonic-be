import express from 'express';
import validate from '../../middlewares/validate';
import { battleController } from '../../controllers';
import { battleValidation } from '../../validations';

const router = express.Router();

router
  .route('/')
  .post(validate(battleValidation.createBattle), battleController.createBattle)
  .get(validate(battleValidation.getBattles), battleController.getBattles);

router
  .route('/:battleId')
  .get(validate(battleValidation.getBattle), battleController.getBattle)
  .patch(validate(battleValidation.updateBattle), battleController.updateBattle)
  .delete(validate(battleValidation.deleteBattle), battleController.deleteBattle);

router.patch('/:battleId/:winnerId', battleController.selectWinner);

export default router;

/**
 * @swagger
 * tags:
 *   name: Battles
 *   description: Battle management and retrieval
 */

/**
 * @swagger
 * /battles:
 *   post:
 *     summary: Create a battle
 *     description: Create a new battle with specified details.
 *     tags: [Battles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstAgentId
 *               - secondAgentId
 *               - description
 *               - active
 *             properties:
 *               firstAgentId:
 *                 type: string
 *                 description: ID of the first agent participating in the battle.
 *               secondAgentId:
 *                 type: string
 *                 description: ID of the second agent participating in the battle.
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Detailed description of the battle (max 500 characters).
 *               active:
 *                 type: boolean
 *                 description: Status of the battle (active or not).
 *               winner:
 *                 type: string
 *                 description: (Optional) ID of the winning agent.
 *               duration:
 *                 type: integer
 *                 minimum: 0
 *                 description: (Optional) Duration of the battle in seconds.
 *             example:
 *               firstAgentId: "agent1"
 *               secondAgentId: "agent2"
 *               description: "Epic battle description"
 *               active: true
 *               winner: "agent1"
 *               duration: 3600
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Battle'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *
 *   get:
 *     summary: Get all battles
 *     description: Retrieve a list of all battles.
 *     tags: [Battles]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter battles by their active status.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort results by a field (e.g., `duration:asc` or `active:desc`).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of results per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number for pagination.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Battle'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 */

/**
 * @swagger
 * /battles/{battleId}:
 *   get:
 *     summary: Get a battle
 *     description: Retrieve details of a specific battle.
 *     tags: [Battles]
 *     parameters:
 *       - in: path
 *         name: battleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Battle ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Battle'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a battle
 *     description: Update details of an existing battle.
 *     tags: [Battles]
 *     parameters:
 *       - in: path
 *         name: battleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Battle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstAgentId:
 *                 type: string
 *                 description: ID of the first agent.
 *               secondAgentId:
 *                 type: string
 *                 description: ID of the second agent.
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Detailed description (max 500 characters).
 *               active:
 *                 type: boolean
 *                 description: Status of the battle (active or not).
 *               winner:
 *                 type: string
 *                 description: (Optional) ID of the winning agent.
 *               duration:
 *                 type: integer
 *                 minimum: 0
 *                 description: (Optional) Duration in seconds.
 *             example:
 *               firstAgentId: "agent3"
 *               secondAgentId: "agent4"
 *               description: "Updated battle description"
 *               active: false
 *               winner: "agent3"
 *               duration: 4200
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Battle'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a battle
 *     description: Remove a specific battle by ID.
 *     tags: [Battles]
 *     parameters:
 *       - in: path
 *         name: battleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Battle ID
 *     responses:
 *       "200":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
