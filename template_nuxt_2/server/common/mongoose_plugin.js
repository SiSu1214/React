let Promise = require('bluebird');
let ObjectId = require('mongoose').Types.ObjectId;
let ErrorCode = require('./error_code');
/**
 * @param {Object}              [query={}]
 * @param {Object}              [options={}]
 * @param {Object|String}         [options.select]
 * @param {Object|String}         [options.sort]
 * @param {Array|Object|String}   [options.populate]
 * @param {Boolean}               [options.lean=false]
 * @param {Boolean}               [options.leanWithId=true]
 * @param {Number}                [options.offset=0] - Use offset or page to set skip position
 * @param {Number}                [options.page=1]
 * @param {Number}                [options.limit=10]
 * @param {Function}            [callback]
 *
 * @returns {Promise}
 */
function paginate(query, options, callback) {
  query = query || {};
  options = global.Object.assign({}, paginate.options, options);

  let select = options.select;
  let sort = options.sort;
  let populate = options.populate;
  let lean = options.lean || false;
  let leanWithId = options.hasOwnProperty('leanWithId')
    ? options.leanWithId
    : true;

  let limit = options.hasOwnProperty('limit') ? Number(options.limit) : 10;
  let skip, offset, page;

  if (options.hasOwnProperty('offset')) {
    offset = Number(options.offset);
    skip = offset;
  } else if (options.hasOwnProperty('page')) {
    page = Number(options.page);
    skip = (page - 1) * limit;
  } else {
    offset = 0;
    page = 1;
    skip = offset;
  }

  let promises = {
    docs: Promise.resolve([]),
    count: this.count(query).exec(),
  };

  if (limit != undefined) {
    query = this.find(query)
      .collation({ locale: 'en_US', numericOrdering: true })
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(lean);

    if (populate) {
      [].concat(populate).forEach(function(item) {
        query.populate(item);
      });
    }

    promises.docs = query.exec();

    if (lean && leanWithId) {
      promises.docs = promises.docs.then(function(docs) {
        docs.forEach(function(doc) {
          doc.id = String(doc._id);
        });

        return docs;
      });
    }
  }

  return Promise.props(promises)
    .then(function(data) {
      let result = {
        docs: data.docs,
        total: data.count,
        limit,
      };

      if (offset !== undefined) {
        result.offset = offset;
      }

      if (page !== undefined) {
        result.page = page;
        result.pages = Math.ceil(data.count / limit) || 1;
      }

      return result;
    })
    .asCallback(callback);
}

function isObjectId(id, callback) {
  let regex = new RegExp('^[0-9a-fA-F]{24}$');
  id = id.toString();
  return Promise.resolve(regex.test(id)).asCallback(callback);
}

function objectIdCheck(id) {
  let regex = new RegExp('^[0-9a-fA-F]{24}$');
  id = id.toString();
  return regex.test(id);
}

function isExisted(eventId, callback) {
  return isObjectId(eventId)
    .then(check => {
      if (check) {
        return this.findById({ _id: ObjectId(eventId) }).then(object => {
          if (object) return object;
          return Promise.reject(ErrorCode.ItemNotFound);
        });
      }
      return Promise.reject(ErrorCode.InvalidId);
    })
    .asCallback(callback);
}

/**
 * @param {Schema} schema
 */
module.exports = function(schema) {
  schema.statics.paginate = paginate;
  schema.statics.isObjectId = isObjectId;
  schema.statics.isExisted = isExisted;
  schema.statics.ObjectId = ObjectId;
  schema.statics.objectIdCheck = objectIdCheck;
};

module.exports.paginate = paginate;
module.exports.isObjectId = isObjectId;
module.exports.isExisted = isExisted;
module.exports.ObjectId = ObjectId;
module.exports.objectIdCheck = objectIdCheck;
