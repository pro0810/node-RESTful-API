const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const urlSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Customer',
      required: true,
    },
    email: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
urlSchema.plugin(toJSON);
urlSchema.plugin(paginate);

/**
 * @typedef Url
 */
const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
