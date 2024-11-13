const problemDiv = document.getElementById('problem');
const choicesDiv = document.getElementById('choices');
const scoreDiv = document.getElementById('score');
const timeDiv = document.getElementById('time');
const gameOverDiv = document.getElementById('game-over');
const finalScoreSpan = document.getElementById('final-score');
const restartButton = document.getElementById('restart');

let score = 0;
let mistakes = 0;
let timer = 60;
let interval;
let correctAnswers = 0;
let pointsPerCorrect = 5;
let pointsPerMistake = 3;
let maxRandomNumber = 10;
let gameActive = true;

function generateRandomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
}

function generateProblem() {
    if (!gameActive) return;

    const operations = ['+', '-', '*', '/', '√'];
    const operation1 = operations[generateRandomNumber(operations.length - 1)];
    const operation2 = operations[generateRandomNumber(operations.length - 1)];

    let num1 = generateRandomNumber(maxRandomNumber);
    let num2 = generateRandomNumber(maxRandomNumber);
    let num3 = generateRandomNumber(maxRandomNumber);

    let result;
    try {
        if (operation1 === '√') num1 = Math.pow(num1, 2);
        if (operation2 === '√') num2 = Math.pow(num2, 2);
        
        let expression = `${num1} ${operation1} ${num2} ${operation2} ${num3}`;
        result = eval(expression);

        if (!Number.isInteger(result) || result < 0 || result > 1000) throw new Error("Resultado inválido");
    } catch {
        return generateProblem();
    }

    displayProblem(num1, num2, num3, operation1, operation2, result);
}

function displayProblem(num1, num2, num3, operation1, operation2, correctAnswer) {
    problemDiv.textContent = `${num1} ${operation1} ${num2} ${operation2} ${num3}`;

    const wrongAnswers = [
        correctAnswer + generateRandomNumber(10) + 1,
        correctAnswer - (generateRandomNumber(10) + 1)
    ];

    const answers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    choicesDiv.innerHTML = '';
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(answer, correctAnswer));
        choicesDiv.appendChild(button);
    });
}

function checkAnswer(selected, correct) {
    if (!gameActive) return;

    if (selected === correct) {
        score += pointsPerCorrect;
        correctAnswers++;
        
        if (correctAnswers % 3 === 0) {
            pointsPerCorrect += 2;
            pointsPerMistake += 2;
        }
        
        if (correctAnswers % 5 === 0) {
            maxRandomNumber += 10;
        }

        scoreDiv.textContent = `Pontos: ${score}`;
        generateProblem();
    } else {
        score -= pointsPerMistake;
        mistakes++;
        scoreDiv.textContent = `Pontos: ${score}`;
        if (mistakes >= 3) {
            endGame();
        }
    }
}

function startGame() {
    score = 0;
    mistakes = 0;
    timer = 60;
    correctAnswers = 0;
    pointsPerCorrect = 5;
    pointsPerMistake = 3;
    maxRandomNumber = 10;
    gameActive = true;

    scoreDiv.textContent = `Pontos: ${score}`;
    timeDiv.textContent = `Tempo: ${timer}s`;

    // Ocultar o quadrante de "Jogo Finalizado" ao iniciar uma nova partida
    gameOverDiv.classList.add('hidden');
    finalScoreSpan.textContent = 0;
    
    interval = setInterval(updateTimer, 1000);
    generateProblem();
}

function updateTimer() {
    if (!gameActive) return;

    timer--;
    timeDiv.textContent = `Tempo: ${timer}s`;
    if (timer <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(interval);
    gameActive = false;

    // Exibir o quadrante "Jogo Finalizado" ao terminar o jogo
    finalScoreSpan.textContent = score;
    gameOverDiv.classList.remove('hidden');
}

restartButton.addEventListener('click', startGame);

// Iniciar o jogo
startGame();
