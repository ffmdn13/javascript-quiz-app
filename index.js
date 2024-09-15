let questionAmount = 10;
let difficulty = "easy";

let selectedType = null;
let hasSelected = false;
let currentQuestion = 0;

let correctAnswer = "";
let shuffledQuestion = [];
let results = null;

let hasAnswered = false;
let currentTrackerWidth = 0;
let numberOfCorrectAnswer = 0;

const startBtn = document.querySelector("#startBtn");
const quizTypes = document.querySelectorAll(".menu-container-category li");
const quizContainer = document.querySelector(".quiz-container");

const nextBtn = document.querySelector("#nextBtn");
const questionTitle = document.querySelector(".question");
const answerList = document.querySelector(".answer-list");

const loadingScreen = document.querySelector(".loading");
const quizTitle = document.querySelector("#quizTitle");
const menuContainer = document.querySelector(".menu-container");

const questionNumber = document.querySelector("#currentQuestion");
const HEX = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

const trackerBar = document.querySelector(".tracker-bar");
const quizCard = document.querySelector(".quiz-card");
const scoreMessages = {
    low: {
        emoji: ["📅", "📚", "📋"],
        message: ["Continue learning", "Checklist needed", "Plan and prepare"],
    },
    medium: {
        emoji: ["📈", "🏋️", "🔥"],
        message: ["Study and refine!", "Lift your performance higher!", "Read and improve!"]
    },
    high: {
        emoji: ["🏆", "🏅", "🎯"],
        message: ["Perfectly hit the mark!", "Fantastic achievement!", "Brilliant performance!"]
    }
};

const settingPage = document.querySelector(".setting-page");
const quizDifficulty = document.querySelector("#difficulty");
const quizQuestions = document.querySelector("#numberOfQuestions");

const selectType = (type) => {
    let li = document.querySelector("li." + type);

    if (li === selectedType) {
        for (data of quizTypes) {
            data.style.opacity = null;
        }

        hasSelected = false;
        selectedType = null;
    } else if (hasSelected === false) {
        for (data of quizTypes) {
            if (data !== li) data.style.opacity = "0.5";
        }

        hasSelected = true;
        selectedType = li;
    }
}

startBtn.addEventListener("click", () => {
    if (selectedType === null) {
        return false;
    }

    loadingScreen.style.opacity = "1";
    loadingScreen.style.pointerEvents = "all";

    let splitSelectedType = selectedType.classList.value.split("-");
    let quizId = splitSelectedType[1] ?? null;

    fetch(`https://opentdb.com/api.php?amount=${questionAmount}&category=${quizId}&difficulty=${difficulty}&type=multiple`)
        .then(response => response.json())
        .then(data => startQuiz(data.results))
        .then(() => {
            loadingScreen.style.opacity = null;
            loadingScreen.style.pointerEvents = null;

            setRandomBackgroundColor();
            quizContainer.style.transform = "translateY(0)";
            quizContainer.style.pointerEvents = "all";
            quizContainer.firstElementChild.style.opacity = "1";
            quizContainer.firstElementChild.style.transform = "translateY(0)";
            menuContainer.style.display = "none";
        })
        .catch(error => console.error(error));
});

const startQuiz = (data) => {
    if (results === null) results = data;
    renderQuiz(results);
}

const renderQuiz = (results) => {
    shuffledQuestion = shuffleQuestion([...results[currentQuestion].incorrect_answers, results[currentQuestion].correct_answer]);

    correctAnswer = results[currentQuestion].correct_answer;
    quizTitle.innerText = results[0].category;
    questionTitle.innerText = results[currentQuestion].question;
    questionNumber.innerText = `${currentQuestion + 1}/${questionAmount}`;
    answerList.innerHTML = `
                <li class="answer" onclick="answer(event)">${shuffledQuestion[0]}</li>
                <li class="answer" onclick="answer(event)">${shuffledQuestion[1]}</li>
                <li class="answer" onclick="answer(event)">${shuffledQuestion[2]}</li>
                <li class="answer" onclick="answer(event)">${shuffledQuestion[3]}</li>
    `;
};

const answer = (event) => {
    if (hasAnswered === true) {
        return;
    }

    if (event.target.innerText === correctAnswer) {
        event.target.classList.add("correct");
        numberOfCorrectAnswer++;
    } else {
        event.target.classList.add("incorrect");
        let li = document.querySelectorAll("li.answer");

        for (data of li) {
            if (data.innerText === correctAnswer) {
                data.classList.add("correct");
            }
        }
    }

    if (currentQuestion + 1 === questionAmount) {
        nextBtn.innerText = "Finish";
    }

    if (currentTrackerWidth < 450) {
        currentTrackerWidth = currentTrackerWidth + (Math.floor(450 / questionAmount));
        trackerBar.style.width = currentTrackerWidth + "px";
    }

    hasAnswered = true;
    nextBtn.style.display = "block";
};

nextBtn.addEventListener("click", () => {
    if (currentQuestion + 1 === questionAmount) {
        renderResultPage();
        return;
    }

    currentQuestion++;
    hasAnswered = false;
    nextBtn.style.display = "none";

    setRandomBackgroundColor();
    renderQuiz(results);
});

function renderResultPage() { 
    numberOfCorrectAnswer = (Math.floor(100 / questionAmount)) * numberOfCorrectAnswer;
    let scoreMessage = getScoreMessage(numberOfCorrectAnswer);

    quizContainer.innerHTML = `
        <div class="finish-page">
            <div class="emoji">${scoreMessage[0]}</div>
            <div class="grade">${numberOfCorrectAnswer}/100</div>
            <p class="short-message">${scoreMessage[1]}</p>

            <a href="index.html" class="back-btn">Start new quiz</a>
        </div>
    `;
}

function setRandomBackgroundColor() { 
    let randomHex = "#";

    for (let i = 0; i < 6; i++) {
        let index = Math.floor(Math.random() * (HEX.length));
        randomHex += HEX[index];
    }

    quizContainer.style.backgroundColor = randomHex;
}

function shuffleQuestion(questions) {
    for (let i = 1; i <= 2; i++) {
        for (let j = questions.length - 1; j > 0; j--) {
            let index = Math.floor(Math.random() * (j + 1));
            let temp = questions[j];

            questions[j] = questions[index];
            questions[index] = temp;
        }
    }

    return questions;
}

function getScoreMessage(score) {
    let emojiIcon = null;
    let message = null;

    switch(true) {
        case score <= 70:
            emojiIcon = scoreMessages.low.emoji[Math.floor(Math.random() * 3)];
            message = scoreMessages.low.message[Math.floor(Math.random() * 3)];
            break;
    
        case score <= 80:
            emojiIcon = scoreMessages.medium.emoji[Math.floor(Math.random() * 3)];
            message = scoreMessages.medium.message[Math.floor(Math.random() * 3)];
            break;

        case score <= 100:
            emojiIcon = scoreMessages.high.emoji[Math.floor(Math.random() * 3)];
            message = scoreMessages.high.message[Math.floor(Math.random() * 3)];
            break;

        default:
            console.log("makanbang");
    }

    return [emojiIcon, message];
}

function shuffleQuestion(questions) {
    for (let i = 1; i <= 2; i++) {
        for (let j = questions.length - 1; j > 0; j--) {
            let index = Math.floor(Math.random() * (j + 1));
            let temp = questions[j];

            questions[j] = questions[index];
            questions[index] = temp;
        }
    }

    return questions;
}

function renderSettingPage() {
    if (settingPage.classList.contains("opacity-1")) {
        settingPage.classList.remove("opacity-1", "pointer-events-all");
        settingPage.style.transform = null;
        return;
    }

    settingPage.classList.add("opacity-1", "pointer-events-all");
    settingPage.style.transform = "translateX(0)";
}

function setQuizSetting() {
    questionAmount = +quizQuestions.value;
    difficulty = quizDifficulty.value;

    if(questionAmount <= 0 || questionAmount >=51) {
        quizQuestions.value = 10;  
        questionAmount = 10; 
    }

    if(!['easy', 'medium', 'hard'].includes(difficulty)) {
        quizDifficulty.value = "easy";
        difficulty = "easy";
    }
}