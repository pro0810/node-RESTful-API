const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { reportTypes, reportStatus } = require('../config/reports');

const createReport = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    url: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid(...reportTypes),
    status: Joi.string()
      .required()
      .valid(...reportStatus),
  }),
};

const getReports = {
  query: Joi.object().keys({
    search: Joi.string(),
    order: Joi.string(),
    sort: Joi.string(),
    items_per_page: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId),
  }),
};

const updateReport = {
  params: Joi.object().keys({
    reportId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      url: Joi.string(),
      type: Joi.string()
        .required()
        .valid(...reportTypes),
      status: Joi.string()
        .required()
        .valid(...reportStatus),
    })
    .min(1),
};

const deleteReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
};
