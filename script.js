const API = "http://localhost:5000";

// LOGIN
function login() {
    fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data !== "Invalid") {
            localStorage.setItem("user", JSON.stringify(data));
            location.href = "dashboard.html";
        }
    });
}

// REGISTER
function register() {
    fetch(API + "/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: "User",
            email: email.value,
            password: password.value
        })
    });
}

// ADD QUESTION
function addQuestion() {
    const div = document.createElement("div");
    div.innerHTML = `
        <input placeholder="Question">
        <input placeholder="Option 1">
        <input placeholder="Option 2">
        <input placeholder="Option 3">
        <input placeholder="Option 4">
        <input placeholder="Answer Index (0-3)">
    `;
    document.getElementById("questions").appendChild(div);
}

// SAVE QUIZ
function saveQuiz() {
    const questions = [];

    document.querySelectorAll("#questions div").forEach(q => {
        const inputs = q.querySelectorAll("input");
        questions.push({
            question: inputs[0].value,
            options: [
                inputs[1].value,
                inputs[2].value,
                inputs[3].value,
                inputs[4].value
            ],
            answer: parseInt(inputs[5].value)
        });
    });

    fetch(API + "/createQuiz", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            title: document.getElementById("title").value,
            questions
        })
    });
}

// START QUIZ
function startQuiz() {
    const id = prompt("Enter Quiz ID:");
    localStorage.setItem("quizId", id);
    location.href = "quiz.html";
}

// LOAD QUIZ
if(window.location.pathname.includes("quiz.html")) {

    let time = 60;

    const timer = setInterval(() => {
        time--;
        document.getElementById("timer").innerText = "Time: " + time;

        if(time <= 0) submitQuiz();
    }, 1000);

    // TAB SWITCH DETECTION
    document.addEventListener("visibilitychange", () => {
        if(document.hidden) {
            alert("Tab switch detected! Auto submit.");
            submitQuiz();
        }
    });

    fetch(API + "/quiz/" + localStorage.getItem("quizId"))
    .then(res => res.json())
    .then(data => {
        document.getElementById("title").innerText = data.title;

        let html = "";

        data.questions.forEach((q, i) => {
            html += `<p>${q.question}</p>`;
            q.options.forEach((opt, j) => {
                html += `
                <input type="radio" name="q${i}" value="${j}">${opt}<br>
                `;
            });
        });

        document.getElementById("quiz").innerHTML = html;

        window.quizData = data;
    });
}

// SUBMIT QUIZ
function submitQuiz() {

    let score = 0;

    quizData.questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name=q${i}]:checked`);
        if(selected && parseInt(selected.value) === q.answer) {
            score++;
        }
    });

    const user = JSON.parse(localStorage.getItem("user"));

    fetch(API + "/result", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: user.name,
            score,
            quizId: localStorage.getItem("quizId")
        })
    });

    alert("Score: " + score);
}