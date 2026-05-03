const mongoose = require("mongoose");

module.exports = mongoose.model("Quiz", {
    title: String,
    questions: [
        {
            question: String,
            options: [String],
            answer: Number
        }
    ]
});