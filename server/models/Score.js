const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    sessionId: String,
    email: String,
    score: Number,
    totalQuestions: Number,
    timeTaken: Number,
    date: { type: Date, default: Date.now }
  }, {
    collection: 'score'
  });
  
  const Score = mongoose.model('Score', scoreSchema);
  
  module.exports = Score;
  