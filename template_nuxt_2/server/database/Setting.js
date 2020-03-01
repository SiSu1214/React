let mongoose = require('mongoose');
let Constant = require('../../constant');
const ErrorCode = require('../common/error_code');
const Promise = require('bluebird');
const plugin = require('../common/mongoose_plugin');
mongoose.Promise = Promise;
let { Model, Schema } = mongoose;

let SettingSchema = new Schema({
  key: String,
  value: Object,
  status: { type: Boolean, default: true },
  view_type: { type: String, default: '' },
  note: String,
});
SettingSchema.plugin(plugin);

let PublicFields = [];

class SettingModel extends Model {
  static getPublicFields() {
    return PublicFields;
  }

  static addSetting(info, callback) {
    if (!info || !info.key)
      return Promise.reject(ErrorCode.MissingParams(info)).asCallback(callback);
    return this.findOneAndUpdate(
      { key: info.key },
      { $set: info },
      { new: true, upsert: true },
    )
      .exec()
      .asCallback(callback);
  }

  static getLanguagesTranslated(callback) {
    return SettingModel.findOne(
      { key: Constant.setting.languagesTranslated.key },
      callback,
    );
  }

  static getLanguageDefault(callback) {
    return SettingModel.findOne(
      { key: Constant.setting.languageDefault.key },
      callback,
    );
  }

  static updateLanguagesTranslated(languages, callback) {
    if (!Array.isArray(languages)) languages = [languages];
    return SettingModel.findOneAndUpdate(
      { key: Constant.setting.languagesTranslated.key },
      { $set: { value: languages } },
      { new: true, upsert: true },
      callback,
    );
  }

  static setLanguageDefault(languageCode, callback) {
    if (!languagesList[languageCode])
      return Promise.reject(ErrorCode.LanguageNotFound).asCallback(callback);
    return SettingModel.findOneAndUpdate(
      { key: Constant.setting.languageDefault.key },
      { $set: { value: languageCode } },
      { new: true, upsert: true },
      callback,
    );
  }

  static editList(settings, callback) {
    let ids = settings.map(function(s) {
      return SettingModel.findByIdAndUpdate(
        s._id,
        { $set: s },
        { new: true, upsert: true },
      ).exec();
    });
    return Promise.all(ids).asCallback(callback);
  }

  static getPublicSettings(callback) {
    return SettingModel.find(
      { key: { $in: Constant.setting_publics } },
      callback,
    );
  }

  static getSetting(key, callback) {
    return this.findOne({ key })
      .exec()
      .asCallback(callback);
  }
}

mongoose.model(SettingModel, SettingSchema);
module.exports = SettingModel;
