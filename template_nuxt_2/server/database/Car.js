let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let { Model, Schema } = mongoose;

let CarSchema = new Schema({
  name: { type: String },
  passenger_quantity: { type: Number, required: true },
  car_group: { type: String, required: true },
  transmission: { type: String, required: true },
  engine: { type: String, required: true },
  equipment: { type: [String] },
  pickup_option: { type: [String] },
  price: Number,
  currency: { type: String, default: 'en' },
  supplier: { type: Schema.Types.ObjectId, ref: 'UserModel' },
});

class CarModel extends Model {}
mongoose.model(CarModel, CarSchema);
module.exports = CarModel;
