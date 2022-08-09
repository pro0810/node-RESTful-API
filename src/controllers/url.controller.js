const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { urlService } = require('../services');

const createUrl = catchAsync(async (req, res) => {
  const url = await urlService.createUrl(req.body);
  res.status(httpStatus.CREATED).send(url);
});

const getUrls = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['url', 'customerId']);
  const search = pick(req.query, ['search']);
  search.name = 'url';
  const options = pick(req.query, ['sort', 'items_per_page', 'page', 'order']);
  const result = await urlService.queryUrls(filter, options, search);
  res.send(result);
});

const getUrl = catchAsync(async (req, res) => {
  const url = await urlService.getUrlById(req.params.urlId);
  if (!url) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Url not found');
  }
  res.send(url);
});

const updateUrl = catchAsync(async (req, res) => {
  const url = await urlService.updateUrlById(req.params.urlId, req.body);
  res.send(url);
});

const deleteUrl = catchAsync(async (req, res) => {
  await urlService.deleteUrlById(req.params.urlId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUrl,
  getUrls,
  getUrl,
  updateUrl,
  deleteUrl,
};
