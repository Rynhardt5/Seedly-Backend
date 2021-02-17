const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const seedSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  scientificName: { type: String, required: true },
  description: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

seedSchema.plugin(uniqueValidator);
seedSchema.plugin(mongoose_fuzzy_searching, {
  fields: ['name', 'scientificName'],
});
seedSchema.set('toJSON', { getters: true });

const Seed = mongoose.model('Seed', seedSchema);

module.exports = Seed;
