let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let { Model, Schema } = mongoose;

let CarAttrSchema = new Schema({
  // isParent: { type: Boolean, default: false },
  parent: { type: Schema.Types.ObjectId, ref: 'CarAttrModel' },
  key: { type: String },
  value: Object,
  active: { type: Boolean, default: true },
});

class CarAttrModel extends Model {}
mongoose.model(CarAttrModel, CarAttrSchema);
module.exports = CarAttrModel;
