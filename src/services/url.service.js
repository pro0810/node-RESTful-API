const httpStatus = require('http-status');
const { Url } = require('../models');
const ApiError = require('../utils/ApiError');
const customerService = require('./customer.service');

/**
 * Create a url
 * @param {Object} urlBody
 * @returns {Promise<Url>}
 */
const createUrl = async (urlBody) => {
  return Url.create(urlBody);
};

/**
 * Query for urls
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUrls = async (filter, options, search) => {
  const urls = await Url.paginate(filter, options, search);
  if (urls.data && urls.data.length) {
    for (let index = 0; index < urls.data.length; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      const customer = await customerService.getCustomerById(urls.data[index].customer);
      if (customer) urls.data[index].email = customer.email;
    }
  }
  // console.log(urls, 'here');
  return urls;
};

/**
 * Get url by id
 * @param {ObjectId} id
 * @returns {Promise<Url>}
 */
const getUrlById = async (id) => {
  return Url.findById(id);
};

/**
 * Update url by id
 * @param {ObjectId} urlId
 * @param {Object} updateBody
 * @returns {Promise<Url>}
 */
const updateUrlById = async (urlId, updateBody) => {
  const url = await getUrlById(urlId);
  if (!url) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Url not found');
  }
  // if (updateBody.email && (await Url.isEmailTaken(updateBody.email, urlId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(url, updateBody);
  await url.save();
  return url;
};

/**
 * Delete url by id
 * @param {ObjectId} urlId
 * @returns {Promise<Url>}
 */
const deleteUrlById = async (urlId) => {
  const url = await getUrlById(urlId);
  if (!url) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Url not found');
  }
  await url.remove();
  return url;
};

module.exports = {
  createUrl,
  queryUrls,
  getUrlById,
  updateUrlById,
  deleteUrlById,
};
