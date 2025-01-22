const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true },
  },
  correctOption: { type: String, required: true },
  marks: { type: Number, default: 5 },
});

module.exports = mongoose.model("Question", QuestionSchema);