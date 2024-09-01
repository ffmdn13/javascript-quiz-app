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
const TRACKERWIDTH = 500 / 10;

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

let selectedType = null;
let hasSelected = false;
let currentQuestion = 0;

let correctAnswer = "";
let shuffledQuestion = [];
let results = null;

let hasAnswered = false;
let currentTrackerWidth = 0;
let numberOfCorrectAnswer = 0;

// Select animation handler for menu-container-category element class
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

// Start the quiz button handler
startBtn.addEventListener("click", () => {
    if (selectedType === null) {
        return false;
    }

    loadingScreen.style.opacity = "1";
    loadingScreen.style.pointerEvents = "all";

    let splitSelectedType = selectedType.classList.value.split("-");
    let quizId = splitSelectedType[1] ?? null;



    fetch(`https://opentdb.com/api.php?amount=10&category=${quizId}&difficulty=medium&type=multiple&`)
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
    questionNumber.innerText = `${currentQuestion + 1}/10`;
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
            console.log(data.innerText);
        }
    }

    if (currentQuestion + 1 === 10) {
        nextBtn.innerText = "Finish";
    }

    hasAnswered = true;
    nextBtn.style.display = "block";
};

nextBtn.addEventListener("click", () => {
    if (currentQuestion + 1 === 10) {
        renderResultPage();
        return;
    }

    currentQuestion++;
    hasAnswered = false;
    nextBtn.style.display = "none";

    if (currentTrackerWidth < 450) {
        currentTrackerWidth += TRACKERWIDTH;
        trackerBar.style.width = currentTrackerWidth + "px";
    }

    setRandomBackgroundColor();
    renderQuiz(results);
});

const renderResultPage = () => {
    let scoreMessage = getScoreMessage(numberOfCorrectAnswer * 10);

    quizContainer.innerHTML = `
        <div class="finish-page">
            <div class="emoji">${scoreMessage[0]}</div>
            <div class="grade">${numberOfCorrectAnswer * 10}/100</div>
            <p class="short-message">${scoreMessage[1]}</p>

            <a href="index.html" class="back-btn">Start new quiz</a>
        </div>
    `;
}

const setRandomBackgroundColor = () => {
    let randomHex = "#";

    for (let i = 0; i < 6; i++) {
        let index = Math.floor(Math.random() * (HEX.length));
        randomHex += HEX[index];
    }

    quizContainer.style.backgroundColor = randomHex;
}

const shuffleQuestion = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
        let index = Math.floor(Math.random() * (i + 1));
        let temp = questions[i];

        questions[i] = questions[index];
        questions[index] = temp;
    }

    return questions;
}

const getScoreMessage = (score) => {
    let emojiIcon = null;
    let message = null;

    if (score < 70) {
        emojiIcon = scoreMessages.low.emoji[Math.floor(Math.random() * 3)];
        message = scoreMessages.low.message[Math.floor(Math.random() * 3)];

        return [emojiIcon, message];
    }

    if (score <= 80) {
        emojiIcon = scoreMessages.medium.emoji[Math.floor(Math.random() * 3)];
        message = scoreMessages.medium.message[Math.floor(Math.random() * 3)];

        return [emojiIcon, message];
    }

    if (score <= 100) {
        emojiIcon = scoreMessages.high.emoji[Math.floor(Math.random() * 3)];
        message = scoreMessages.high.message[Math.floor(Math.random() * 3)];

        return [emojiIcon, message];
    }
}

