const mongoose = require('mongoose');
const validator = require('validator');

const { toJSON, paginate } = require('./plugins');
const { reportTypes, reportStatus } = require('../config/reports');

const reportSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    type: {
      type: String,
      enum: reportTypes,
    },
    status: {
      type: String,
      enum: reportStatus,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reportSchema.plugin(toJSON);
reportSchema.plugin(paginate);

/**
 * @typedef Report
 */
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
