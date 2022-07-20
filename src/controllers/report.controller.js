const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');

const createReport = catchAsync(async (req, res) => {
  const report = await reportService.createReport(req.body);
  res.status(httpStatus.CREATED).send(report);
});

const getReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const search = pick(req.query, ['search']);
  search.name = 'url';
  const options = pick(req.query, ['sort', 'items_per_page', 'page', 'order']);
  const result = await reportService.queryReports(filter, options, search);
  res.send(result);
});

const getReport = catchAsync(async (req, res) => {
  const report = await reportService.getReportById(req.params.reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  res.send({ data: report });
});

const updateReport = catchAsync(async (req, res) => {
  const report = await reportService.updateReportById(req.params.reportId, req.body);
  res.send(report);
});

const deleteReport = catchAsync(async (req, res) => {
  await reportService.deleteReportById(req.params.reportId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
};
