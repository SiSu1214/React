const debug = require('debug')('temp');

const Jimp = require('jimp');

async function resizeImage(rootImagePath, newImagePath, _callback) {
  // open a file called "lenna.png"
  debug('jaa', rootImagePath);
  return Jimp.read(rootImagePath, function(err, lenna) {
    debug('err', err);
    if (err) {
      debug(err);
      return _callback(err.message);
    }

    const width = lenna.bitmap.width;
    const height = lenna.bitmap.height;
    const cropDistance = width > height ? height : width;
    const startPointX = (width - cropDistance) / 2;
    const startPointY = (height - cropDistance) / 3;
    debug('conaa');
    lenna
      .crop(startPointX, startPointY, cropDistance, cropDistance) // resize
      .write(newImagePath); // save
    _callback(0, newImagePath);
  });
}

module.exports = Jimp;
module.exports.resizeImage = resizeImage;
