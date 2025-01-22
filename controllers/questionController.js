const Question = require("../models/Question");

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};