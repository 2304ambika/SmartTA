// models/Poll.js
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  hints: [String],
  responses: {
    A: { type: Number, default: 0 },
    B: { type: Number, default: 0 },
    C: { type: Number, default: 0 },
    D: { type: Number, default: 0 },
  },
  status: { type: String, default: 'active' },
},{
    collection:'poll'
  });

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;