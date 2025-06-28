// ==== 1. Questions Organized by Topic ==== //
const quizData = {
    "English": [
        {
            question: "What is the synonym of 'happy'?",
            options: ["Sad", "Joyful", "Angry", "Tired"],
            answer: 1,
            explanation: "A synonym for 'happy' is 'joyful'."
        },
        {
            question: "Choose the correct spelling:",
            options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"],
            answer: 2,
            explanation: "'Accommodate' is the correct spelling."
        }
    ],
    "Math": [
        {
            question: "What is 15 + 6?",
            options: ["21", "22", "23", "20"],
            answer: 0,
            explanation: "15 + 6 = 21."
        },
        {
            question: "What is the value of π (up to 2 decimal places)?",
            options: ["3.12", "3.14", "3.16", "3.18"],
            answer: 1,
            explanation: "π = 3.14 (approx)."
        }
    ],
    "Biology": [
        {
            question: "What is the basic unit of life?",
            options: ["Tissue", "Organ", "Cell", "Organism"],
            answer: 2,
            explanation: "The cell is the basic unit of life."
        }
    ],
    "Chemistry": [
        {
            question: "What is H2O commonly known as?",
            options: ["Hydrogen Peroxide", "Oxygen", "Water", "Salt"],
            answer: 2,
            explanation: "H2O is the chemical formula for water."
        }
    ],
    "Physics": [
        {
            question: "What force keeps us on the ground?",
            options: ["Magnetism", "Gravity", "Friction", "Electricity"],
            answer: 1,
            explanation: "Gravity keeps us on the ground."
        }
    ],
    "Computer": [
        {
            question: "Who is known as the father of computers?",
            options: ["Charles Babbage", "Bill Gates", "Alan Turing", "Steve Jobs"],
            answer: 0,
            explanation: "Charles Babbage is known as the father of computers."
        }
    ]
};

// ==== 2. Variables ==== //
let currentTopic = "";
let questions = [];
let currentQuestion = 0;
let score = 0;
let timer = 30;
let timerInterval;

// ==== 3. DOM Elements ==== //
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const topicsList = document.getElementById('topics-list');
const categoryElem = document.getElementById('category');
const timerElem = document.getElementById('timer');
const progressElem = document.getElementById('progress-bar');
const questionBox = document.getElementById('question-box');
const optionsBox = document.getElementById('options-box');
const nextBtn = document.getElementById('next-btn');
const resultSummary = document.getElementById('result-summary');
const restartBtn = document.getElementById('restart-btn');

// ==== 4. Render Topics ==== //
function renderTopics() {
    topicsList.innerHTML = "";
    Object.keys(quizData).forEach(topic => {
        const btn = document.createElement('button');
        btn.textContent = topic;
        btn.className = 'topic-btn';
        btn.addEventListener('click', () => selectTopic(topic, btn));
        topicsList.appendChild(btn);
    });
}
renderTopics();

// ==== 5. Topic Selection ==== //
function selectTopic(topic, btn) {
    currentTopic = topic;
    questions = shuffleArray([...quizData[topic]]);
    currentQuestion = 0;
    score = 0;
    timer = 30;

    // Highlight selected topic
    document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    setTimeout(() => {
        homeScreen.style.display = "none";
        quizScreen.style.display = "flex";
        showQuestion();
        startTimer();
    }, 350);
}

// ==== 6. Show Question ==== //
function showQuestion() {
    resetState();
    let q = questions[currentQuestion];
    categoryElem.textContent = currentTopic;
    progressElem.textContent = `Q${currentQuestion + 1}/${questions.length}`;
    questionBox.textContent = q.question;

    // Shuffle options
    const shuffledOptions = shuffleArray(q.options.map((opt, i) => ({ opt, idx: i })));
    shuffledOptions.forEach(({ opt, idx }) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.className = 'option-btn';
        btn.addEventListener('click', () => selectOption(idx, btn));
        optionsBox.appendChild(btn);
    });
}

function resetState() {
    optionsBox.innerHTML = '';
    nextBtn.style.display = "none";
}

// ==== 7. Answer Selection ==== //
function selectOption(selectedIdx, btn) {
    let q = questions[currentQuestion];
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selectedIdx === q.answer) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('incorrect');
        // Mark correct one
        allBtns.forEach((b, i) => {
            if (i === q.answer) b.classList.add('correct');
        });
    }
    // Show explanation
    const exp = document.createElement('div');
    exp.className = "explanation";
    exp.style.cssText = "margin:10px 0 0 0; color:#4f8cff; font-size:0.98em;";
    exp.textContent = "Explanation: " + q.explanation;
    optionsBox.appendChild(exp);

    nextBtn.style.display = "block";
    stopTimer();
}

// ==== 8. Next Question ==== //
nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        timer = 30;
        showQuestion();
        startTimer();
    } else {
        showResult();
    }
});

// ==== 9. Show Result ==== //
function showResult() {
    quizScreen.style.display = "none";
    resultScreen.style.display = "flex";
    resultSummary.innerHTML = `
        <p>Your Score: <strong>${score}</strong> / ${questions.length}</p>
        <p>Percentage: <strong>${Math.round((score / questions.length) * 100)}%</strong></p>
    `;
}

// ==== 10. Timer ==== //
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
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    // Mark correct one
    allBtns.forEach((b, i) => {
        if (i === questions[currentQuestion].answer) b.classList.add('correct');
    });
    // Show explanation
    let q = questions[currentQuestion];
    const exp = document.createElement('div');
    exp.className = "explanation";
    exp.style.cssText = "margin:10px 0 0 0; color:#4f8cff; font-size:0.98em;";
    exp.textContent = "Explanation: " + q.explanation;
    optionsBox.appendChild(exp);

    nextBtn.style.display = "block";
}

// ==== 11. Restart Quiz ==== //
restartBtn.addEventListener('click', () => {
    resultScreen.style.display = "none";
    homeScreen.style.display = "flex";
});

// ==== 12. Utility: Shuffle ==== //
function shuffleArray(arr) {
    let a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}