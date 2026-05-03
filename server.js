const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Quiz = require("./models/Quiz");
const Result = require("./models/Result");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/quizapp");

// REGISTER
app.post("/register", async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send("User Registered");
});

// LOGIN
app.post("/login", async (req, res) => {
    const user = await User.findOne(req.body);
    if (user) res.send(user);
    else res.send("Invalid");
});

// CREATE QUIZ
app.post("/createQuiz", async (req, res) => {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.send("Quiz Created");
});

// GET QUIZ
app.get("/quiz/:id", async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    res.send(quiz);
});

// SAVE RESULT
app.post("/result", async (req, res) => {
    const result = new Result(req.body);
    await result.save();
    res.send("Saved");
});

app.listen(5000, () => console.log("Server running on 5000"));