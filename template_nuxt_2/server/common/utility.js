const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const request = require('request');
let debug = console.error;

const catchError = fn => (req, res, next) =>
  fn(req, res, next).catch(e => generateMessage(res, e));

if (!('toJSON' in Error.prototype))
  Object.defineProperty(Error.prototype, 'toJSON', {
    value() {
      let alt = {};

      Object.getOwnPropertyNames(this).forEach(function(key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });

function generateMessage(res, error, data, header = 400) {
  try {
    if (error) {
      res.status(header);
    } else {
      res.status(200);
    }
    // if (error instanceof Error) {

    // }
    res.json({ success: !error, data: data || error });
  } catch (e) {
    res.status(404);
    res.json({ success: 0, data: e.toString() });
  }
}

function createPassword(password) {
  return crypto
    .createHash('md5')
    .update(password)
    .digest('hex');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * try writing a file in a created directory
 */
let write = function(locale, contents, directory, directoryPermissions = 775) {
  let stats, target, tmp;

  // creating directory if necessary
  try {
    stats = fs.lstatSync(directory);
  } catch (e) {
    debug('creating locales dir in: ' + directory);
    fs.mkdirSync(directory, directoryPermissions);
  }

  // writing to tmp and rename on success
  try {
    target = getStorageFilePath(locale, directory);
    tmp = target + '.tmp';
    fs.writeFileSync(
      tmp,
      typeof contents === 'string'
        ? contents
        : JSON.stringify(contents, null, '\t'),
      'utf8',
    );
    stats = fs.statSync(tmp);
    if (stats.isFile()) {
      fs.renameSync(tmp, target);
    } else {
      debug(
        'unable to write locales to file (either ' +
          tmp +
          ' or ' +
          target +
          ' are not writeable?): ',
      );
    }
  } catch (e) {
    debug(
      'unexpected error writing files (either ' +
        tmp +
        ' or ' +
        target +
        ' are not writeable?): ',
      e,
    );
  }
};

/**
 * basic normalization of filepath
 */
let getStorageFilePath = function(locale, directory) {
  // changed API to use .json as default, #16
  let ext = '.json';
  let filepath = path.normalize(directory + path.sep + locale + ext);
  let filepathJS = path.normalize(directory + path.sep + locale + ext);
  // use .js as fallback if already existing
  try {
    if (fs.statSync(filepathJS)) {
      debug('using existing file ' + filepathJS);
      return filepathJS;
    }
  } catch (e) {
    debug('will use ' + filepath);
  }
  return filepath;
};

function createFolder(newPath) {
  newPath = path.normalize(newPath);
  if (!fs.existsSync(newPath)) {
    const sep = path.sep;
    const initDir = path.isAbsolute(newPath) ? sep : '';
    let paths = newPath.split(sep);
    let last = paths[paths.length - 1];
    if (path.extname(last)) delete paths[paths.length - 1];
    newPath = paths.reduce((parentDir, childDir) => {
      const curDir = path.resolve(parentDir, childDir);
      if (!fs.existsSync(curDir)) {
        fs.mkdirSync(curDir);
      }

      return curDir;
    }, initDir);
  }

  return newPath;
}

function download(uri, filename) {
  return new Promise(function(resolve, reject) {
    createFolder(filename);
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on('close', function() {
        debug('done', filename);
        resolve(filename);
      })
      .on('error', function(err) {
        debug('err', err);
        reject(err);
      });
  });
}

function move(oldPath, dir, pathFile) {
  let newPath = path.join(dir, pathFile);
  createFolder(newPath);
  return new Promise(function(resolve, reject) {
    function callback(err, rs) {
      if (err) return reject(err);
      resolve(pathFile);
    }

    fs.rename(oldPath, newPath, function(err) {
      if (err) {
        if (err.code === 'EXDEV') {
          copy();
        } else {
          callback(err);
        }
        return;
      }
      callback();
    });

    function copy() {
      let readStream = fs.createReadStream(oldPath);
      let writeStream = fs.createWriteStream(newPath);

      readStream.on('error', callback);
      writeStream.on('error', callback);

      readStream.on('close', function() {
        fs.unlink(oldPath, callback);
      });

      readStream.pipe(writeStream);
    }
  });
}
module.exports = {
  generateMessage,
  createPassword,
  getRandomInt,
  writeTranslate: write,
  catchError,
  createFolder,
  download,
  move,
};
