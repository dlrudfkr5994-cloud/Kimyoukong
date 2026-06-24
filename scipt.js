// 문제 데이터 배열: 각 문제마다 원하는 초 단위 시간을 'timeLimit'으로 지정할 수 있습니다.
const quizData = [
    {
        question: "다음 빈칸에 알맞은 be동사는?\n 'She ______ a middle school student.'",
        options: ["am", "are", "is", "be"],
        answer: "is",
        timeLimit: 10 // 이 문제는 10초 제한
    },
    {
        question: "단어 'library'의 뜻으로 올바른 것은?",
        options: ["도서관", "박물관", "공원", "은행"],
        answer: "도서관",
        timeLimit: 15 // 이 문제는 15초 제한 (조금 더 시간을 줌)
    },
    {
        question: "다음 중 성격이 '다른' 단어 하나는?",
        options: ["Apple", "Banana", "Desk", "Orange"],
        answer: "Desk",
        timeLimit: 8  // 이 문제는 쉬우니까 8초 제한
    }
];

let currentQuiz = 0;
let score = 0;
let timeLeft;       // 문제마다 바뀔 남은 시간 변수
let timerInterval;  // 타이머를 제어할 변수

const questionNumberEl = document.getElementById('question-number');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const quizBox = document.getElementById('quiz-box');
const resultBox = document.getElementById('result-box');
const scoreTextEl = document.getElementById('score-text');
const restartBtn = document.getElementById('restart-btn');
const timeLeftEl = document.getElementById('time-left');

// 퀴즈 시작 함수
function loadQuiz() {
    deselectAnswers();
    clearInterval(timerInterval); // 기존 타이머 초기화
    
    const currentQuizData = quizData[currentQuiz];
    
    // 현재 문제에 설정된 'timeLimit'을 가져옵니다. 없으면 기본값 10초로 설정합니다.
    timeLeft = currentQuizData.timeLimit ? currentQuizData.timeLimit : 10;
    timeLeftEl.innerText = timeLeft;
    startTimer();  // 타이머 작동 시작
    
    questionNumberEl.innerText = `Question ${currentQuiz + 1} of ${quizData.length}`;
    questionTextEl.innerText = currentQuizData.question;
    
    optionsContainer.innerHTML = '';
    
    currentQuizData.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(button, currentQuizData.answer));
        optionsContainer.appendChild(button);
    });
}

// 타이머 카운트다운 함수
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftEl.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOutAction(); // 0초가 되었을 때 실행할 함수
        }
    }, 1000);
}

// 시간 초과 시 작동할 로직
function timeOutAction() {
    const currentQuizData = quizData[currentQuiz];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    
    allButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === currentQuizData.answer) {
            btn.classList.add('correct');
        }
    });
    
    nextBtn.classList.remove('hidden'); // 다음 문제 버튼 표시
}

// 답안 선택 시 피드백
function selectAnswer(selectedButton, correctAnswer) {
    clearInterval(timerInterval); // 답을 고르면 타이머를 멈춤
    
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    
    allButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === correctAnswer) {
            btn.classList.add('correct');
        }
    });

    if (selectedButton.innerText === correctAnswer) {
        score++;
    } else {
        selectedButton.classList.add('wrong');
    }
    
    nextBtn.classList.remove('hidden');
}

// 다음 버튼 초기화
function deselectAnswers() {
    nextBtn.classList.add('hidden');
}

// 다음 버튼 클릭 이벤트
nextBtn.addEventListener('click', () => {
    currentQuiz++;
    
    if (currentQuiz < quizData.length) {
        loadQuiz();
    } else {
        quizBox.classList.add('hidden');
        resultBox.classList.remove('hidden');
        scoreTextEl.innerText = `${quizData.length}문제 중 ${score}문제를 맞췄어요! 🎉`;
    }
});

// 다시하기 버튼 이벤트
restartBtn.addEventListener('click', () => {
    currentQuiz = 0;
    score = 0;
    resultBox.classList.add('hidden');
    quizBox.classList.remove('hidden');
    loadQuiz();
});

// 처음 웹페이지 로드시 실행
loadQuiz();
