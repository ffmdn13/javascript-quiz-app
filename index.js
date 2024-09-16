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

const settingPage = document.querySelector(".setting-page");
const quizDifficulty = document.querySelector("#difficulty");
const quizQuestions = document.querySelector("#numberOfQuestions");

function selectQuizType(type) {
    let li = document.querySelector("li." + type);

    if (li === selectedType) {
        for (data of quizTypes) {
            data.style.opacity = null;
        }

        hasSelected = false;
        selectedType = null;

        return;
    }

    if (hasSelected === false) {
        for (data of quizTypes) {
            if (data !== li) data.style.opacity = "0.5";
        }

        hasSelected = true;
        selectedType = li;

        return;
    }
}

function startQuiz() {
    if (selectedType === null) {
        return false;
    }

    loadingScreen.classList.add("opacity-1", "pointer-events-all");
    let splitSelectedType = selectedType.classList.value.split("-");
    let quizId = splitSelectedType[1] ?? null;

    fetch(`https://opentdb.com/api.php?amount=${questionAmount}&category=${quizId}&difficulty=${difficulty}&type=multiple`)
        .then(response => response.json())
        .then((data) => {
            loadingScreen.classList.remove("opacity-1", "pointer-events-all");
            setBackgroundColor();

            quizContainer.classList.add("opacity-1", "pointer-events-all");
            quizContainer.style.transform = "translateY(0)";
            quizContainer.firstElementChild.classList.add("opacity-1");
            quizContainer.firstElementChild.style.transform = "translateY(0)";
            menuContainer.classList.add("display-none");

            return data;
        })
        .then(data => initializeQuiz(data.results))
        .catch(error => console.error(error));
}

function initializeQuiz(data) {
    if (results === null) results = data;
    renderQuiz(results);
}

function renderQuiz(results) {
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

function answer(event) {
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

    nextBtn.classList.replace("display-none", "display-block");
};

function nextQuestion() {
    if (currentQuestion + 1 === questionAmount) {
        return renderResultPage();
    }

    currentQuestion++;
    hasAnswered = false;
    nextBtn.classList.replace("display-block", "display-none")
    setBackgroundColor();

    return renderQuiz(results);
}

function renderResultPage() {
    numberOfCorrectAnswer = (Math.floor(100 / questionAmount)) * numberOfCorrectAnswer;
    let scoreInformations = getScoreInformations(numberOfCorrectAnswer);

    quizContainer.innerHTML = `
        <div class="result-page">
            <div class="emoji">${scoreInformations[0]}</div>
            <div class="grade">${numberOfCorrectAnswer}/100</div>
            <p class="short-message">${scoreInformations[1]}</p>

            <a href="index.html" class="back-btn">Start new quiz</a>
        </div>
    `;
}

function setBackgroundColor() {
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

function getScoreInformations(score) {
    let emojiIcon = null;
    let message = null;
    const scoreMessages = getScoreMessages();

    switch (true) {
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

    if (questionAmount <= 0 || questionAmount >= 51) {
        quizQuestions.value = 10;
        questionAmount = 10;
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        quizDifficulty.value = "easy";
        difficulty = "easy";
    }
}

function getScoreMessages() {
    return {
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
}