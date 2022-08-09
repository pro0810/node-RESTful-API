const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUrl = {
  body: Joi.object().keys({
    url: Joi.string().required(),
    customerId: Joi.string().custom(objectId),
  }),
};

const getUrls = {
  query: Joi.object().keys({
    url: Joi.string(),
    customerId: Joi.string().custom(objectId),
    search: Joi.string(),
    order: Joi.string(),
    sort: Joi.string(),
    items_per_page: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUrl = {
  params: Joi.object().keys({
    urlId: Joi.string().custom(objectId),
  }),
};

const updateUrl = {
  params: Joi.object().keys({
    urlId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      url: Joi.string(),
      customerId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteUrl = {
  params: Joi.object().keys({
    urlId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUrl,
  getUrls,
  getUrl,
  updateUrl,
  deleteUrl,
};
