const { default: mongoose } = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
  }
});

module.exports = mongoose.model('Token', tokenSchema);