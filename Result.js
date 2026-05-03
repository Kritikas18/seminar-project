const mongoose = require("mongoose");

module.exports = mongoose.model("Result", {
    username: String,
    score: Number,
    quizId: String
});