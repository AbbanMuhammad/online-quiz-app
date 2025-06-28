// ==== 1. Sample Questions ==== //
const quizQuestions = [
    {
        category: "General Knowledge",
        question: "What is the capital of France?",
        options: ["Berlin", "London", "Paris", "Rome"],
        answer: 2 // index of "Paris"
    },
    {
        category: "Science",
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: 1 // index of "Mars"
    },
    {
        category: "Math",
        question: "What is 7 x 8?",
        options: ["54", "56", "58", "60"],
        answer: 1 // index of "56"
    }
];

// ==== 2. Variables ==== //
let currentQuestion = 0;
let score = 0;
let timer = 30; // seconds per quiz
let timerInterval;

// ==== 3. DOM Elements ==== //
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const categoryElem = document.getElementById('category');
const timerElem = document.getElementById('timer');
const questionBox = document.getElementById('question-box');
const optionsBox = document.getElementById('options-box');
const resultSummary = document.getElementById('result-summary');

// ==== 4. Event Listeners ==== //
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', () => {
    resultScreen.style.display = "none";
    homeScreen.style.display = "flex";
});

function startQuiz() {
    homeScreen.style.display = "none";
    quizScreen.style.display = "flex";
    currentQuestion = 0;
    score = 0;
    timer = 30;
    showQuestion();
    startTimer();
}

function showQuestion() {
    resetState();
    let q = quizQuestions[currentQuestion];
    categoryElem.textContent = q.category;
    questionBox.textContent = q.question;

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.classList.add('option-btn');
        btn.addEventListener('click', () => selectOption(index, btn));
        optionsBox.appendChild(btn);
    });
}

function resetState() {
    optionsBox.innerHTML = '';
    nextBtn.style.display = "none";
}

function selectOption(selectedIdx, btn) {
    let q = quizQuestions[currentQuestion];
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selectedIdx === q.answer) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('incorrect');
        allBtns[q.answer].classList.add('correct');
    }
    nextBtn.style.display = "block";
    stopTimer();
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        timer = 30;
        showQuestion();
        startTimer();
    } else {
        showResult();
    }
}

function showResult() {
    quizScreen.style.display = "none";
    resultScreen.style.display = "flex";
    resultSummary.innerHTML = `
        <p>Your Score: <strong>${score}</strong> / ${quizQuestions.length}</p>
        <p>Percentage: <strong>${Math.round((score/quizQuestions.length)*100)}%</strong></p>
    `;
}

function startTimer() {
    timerElem.textContent = `Time: ${timer}s`;
    timerInterval = setInterval(() => {
        timer--;
        timerElem.textContent = `Time: ${timer}s`;
        if (timer === 0) {
            stopTimer();
            autoSelect();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function autoSelect() {
    // If time runs out, mark the correct answer and move on
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    allBtns[quizQuestions[currentQuestion].answer].classList.add('correct');
    nextBtn.style.display = "block";
}

// Optionally: add True/False or more categories as enhancement!

// ==== End of File ==== //