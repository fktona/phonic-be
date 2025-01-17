import Joi from 'joi';

const createAgent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    style: Joi.string().required(),
    model: Joi.string().required(),
    firstMessage: Joi.string().optional(),
    instructions: Joi.string().required(),
    voice: Joi.string().required(),
    voiceId: Joi.string().required(),
    image_url: Joi.string().uri().optional() // Optional and must be a valid URI
  })
};

const getAgents = {
  query: Joi.object().keys({
    style: Joi.string(),
    model: Joi.string(), // Optional filter by model
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1)
  })
};

const getAgent = {
  params: Joi.object().keys({
    agentId: Joi.string().required() // Ensure agentId is required
  })
};

const updateAgent = {
  params: Joi.object().keys({
    agentId: Joi.string().required() // Ensure agentId is required
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      style: Joi.string(),
      model: Joi.string(),
      firstMessage: Joi.string().optional(),
      instructions: Joi.string(),
      voice: Joi.string(),
      image_url: Joi.string().uri().optional()
    })
    .min(1) // Require at least one field to be updated
};

const deleteAgent = {
  params: Joi.object().keys({
    agentId: Joi.string().required() // Ensure agentId is required
  })
};

export default {
  createAgent,
  getAgents,
  getAgent,
  updateAgent,
  deleteAgent
};
