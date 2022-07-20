/* eslint-disable no-param-reassign */
const escapeStringRegexp = require('escape-string-regexp');

const nextPageLink = (page, totalPages) => (page + 1 > totalPages ? null : `/?page=${page + 1}`);
const prevPageLink = (page) => (page - 1 > 0 ? `/?page=${page - 1}` : null);
const nextPage = (page, totalPages) => (page + 1 > totalPages ? null : page + 1);
const prevPage = (page) => (page - 1 > 0 ? page - 1 : null);

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options, search = {}) {
    let sort = '';
    if (options.sort) {
      // const sortingCriteria = [];
      // options.sortBy.split(',').forEach((sortOption) => {
      //   const [key, order] = sortOption.split(':');
      //   sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      // });
      sort = `${options.order === 'desc' ? '-' : ''}${options.sort}`;
    } else {
      sort = 'createdAt';
    }

    const limit =
      options.items_per_page && parseInt(options.items_per_page, 10) > 0 ? parseInt(options.items_per_page, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    if (search.search) {
      const $regex = escapeStringRegexp(search.search);
      filter = {
        ...filter,
        [search.name]: { $regex },
      };
    }
    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit) ? Math.ceil(totalResults / limit) : 1;
      const links = [
        { url: prevPageLink(page), label: '&laquo; Previous', active: false, page: prevPage(page) },
        // { url: '/?page=1', label: '1', active: true, page: 1 },
        // { url: '/?page=2', label: '2', active: false, page: 2 },
        // { url: '/?page=3', label: '3', active: false, page: 3 },
        // { url: '/?page=2', label: 'Next &raquo;', active: false, page: 2 },
      ];
      const startPage = page - 5 > 0 ? page - 5 : 1;
      const endPage = page + 5 > totalPages ? totalPages : page + 5;

      for (let pageNum = startPage; pageNum <= endPage; pageNum += 1) {
        links.push({ url: `/?page=${pageNum}`, label: `${pageNum}`, active: pageNum === page, page: pageNum });
      }

      links.push({
        url: nextPageLink(page, totalPages),
        label: 'Next &raquo;',
        active: false,
        page: nextPage(page, totalPages),
      });

      const result = {
        data: results,
        payload: {
          pagination: {
            first_page_url: '/?page=1',
            from: skip + 1,
            items_per_page: String(limit),
            last_page: totalPages,
            links,
            next_page_url: nextPageLink(page, totalPages),
            page,
            prev_page_url: prevPageLink(page),
            to: skip + limit > totalResults ? totalResults : skip + limit,
            total: totalResults,
          },
        },
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
