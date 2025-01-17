import Joi from 'joi';

const createBattle = Joi.object().keys({
  firstAgentId: Joi.string().required().messages({
    'any.required': 'First agent ID is required.',
    'string.base': 'First agent ID must be a valid string.'
  }),
  secondAgentId: Joi.string().required().messages({
    'any.required': 'Second agent ID is required.',
    'string.base': 'Second agent ID must be a valid string.'
  }),
  description: Joi.string().max(500).required().messages({
    'any.required': 'Description is required.',
    'string.base': 'Description must be a string.',
    'string.max': 'Description cannot exceed 500 characters.'
  }),
  active: Joi.boolean().required().messages({
    'any.required': 'Active status is required.'
  }),
  winner: Joi.string().optional().messages({
    'string.base': 'Winner must be a valid ID.'
  }),
  duration: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Duration must be a valid number.',
    'number.min': 'Duration cannot be negative.'
  })
});

const getBattles = Joi.object().keys({
  active: Joi.boolean().optional(),
  sortBy: Joi.string().optional(),
  limit: Joi.number().integer().min(1).default(10).messages({
    'number.base': 'Limit must be a number.',
    'number.min': 'Limit must be at least 1.'
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number.',
    'number.min': 'Page must be at least 1.'
  })
});

const getBattle = Joi.object().keys({
  battleId: Joi.string().required().messages({
    'any.required': 'Battle ID is required.',
    'string.base': 'Battle ID must be a valid string.'
  })
});

const updateBattle = Joi.object().keys({
  firstAgentId: Joi.string().optional().messages({
    'string.base': 'First agent ID must be a valid string.'
  }),
  secondAgentId: Joi.string().optional().messages({
    'string.base': 'Second agent ID must be a valid string.'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.base': 'Description must be a string.',
    'string.max': 'Description cannot exceed 500 characters.'
  }),
  active: Joi.boolean().optional(),
  winner: Joi.string().optional().messages({
    'string.base': 'Winner must be a valid ID.'
  }),
  duration: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Duration must be a valid number.',
    'number.min': 'Duration cannot be negative.'
  })
});

const deleteBattle = Joi.object().keys({
  battleId: Joi.string().required().messages({
    'any.required': 'Battle ID is required.',
    'string.base': 'Battle ID must be a valid string.'
  })
});

export default {
  createBattle,
  getBattles,
  getBattle,
  updateBattle,
  deleteBattle
};
