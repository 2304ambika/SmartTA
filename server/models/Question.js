const mongoose = require('mongoose');

// const QuestionSchema = new mongoose.Schema({
//   question: String,
//   options: [String],
//   correct_options: [String],
//   purpose: String,
//   jsonFilePath: String,
//   pptFilePath: String,
// });

const QuestionSchema = new mongoose.Schema({
  questions: Array,
  purpose: String,
  title: String,
  status: { type: String, enum: ['accepted', 'rejected', 'none'], default: 'none' },
  sessionId: String,
  date: { type: String }
},{
  collection:'questions'
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
