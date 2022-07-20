const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createCustomer = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getCustomers = {
  query: Joi.object().keys({
    search: Joi.string(),
    order: Joi.string(),
    sort: Joi.string(),
    items_per_page: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCustomer = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateCustomer = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      username: Joi.string(),
    })
    .min(1),
};

const deleteCustomer = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
