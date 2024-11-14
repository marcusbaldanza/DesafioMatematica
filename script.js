const problemDiv = document.getElementById('problem');
const choicesDiv = document.getElementById('choices');
const scoreDiv = document.getElementById('score');
const mistakesSpan = document.getElementById("mistakes"); // Elemento para exibir erros
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
let maxRandomNumber = 5;
let gameActive = true;

function generateRandomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
}

function generateProblem() {
    if (!gameActive) return;

    const operations = ['+', '-', '*','/','√'];
    const operation1 = operations[generateRandomNumber(operations.length - 1)];
    const operation2 = operations[generateRandomNumber(operations.length - 1)];

    let num1 = generateRandomNumber(maxRandomNumber);
    let num2 = generateRandomNumber(maxRandomNumber);
    let num3 = generateRandomNumber(maxRandomNumber);
    //console.log(num1);
    //console.log(num2);
    //console.log(num3);
    //console.log(operation1);
    //console.log(operation2);

    let result;
    try {
        if (operation1 === '√') num1 = Math.pow(num1, 2);
        if (operation2 === '√') num2 = Math.pow(num2, 2);
        
        let expression = `${num1} ${operation1} ${num2} ${operation2} ${num3}`;
        result = eval(expression);

        if (!Number.isInteger(result) || result < 0 || result > 1000) throw new Error("Resultado inválido");
        console.log(result);
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
            maxRandomNumber += 5;
        }

        scoreDiv.textContent = `Pontos: ${score}`;
        generateProblem();
    } else {
        score -= pointsPerMistake;
        mistakes++;
        mistakesSpan.textContent = mistakes;  
        //console.log(mistakes);      
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
    maxRandomNumber = 5;
    gameActive = true;

    scoreDiv.textContent = `Pontos: ${score}`;
    timeDiv.textContent = `Tempo: ${timer}s`;
    mistakesSpan.textContent = mistakes; // Reinicia o contador de erros exibido

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

    // Exibir pontuação final
    finalScoreSpan.textContent = score;
    
    // Exibir mensagem cômica com base na pontuação
    const finalMessage = document.getElementById("final-message");
    if (score <= 0) {
        finalMessage.textContent = "Caramba, você sabe o que é matemática? Medo de você precisar trabalhar com números!";
    } else if (score > 0 && score <= 30) {
        finalMessage.textContent = "Fugiu da escola? Precisa estudar mais, matemática salva vidas!";
    } else if (score > 30 && score <= 60) {
        finalMessage.textContent = "Vamos praticar mais, assim vão te fazer de bobo(a) até em troco de padaria!";
    } else if (score > 60 && score <= 90) {
        finalMessage.textContent = "Sinto que neurônios foram fritados mas precisa tirar mais o ferrugem, continue praticando!";
    } else if (score > 90 && score <= 120) {
        finalMessage.textContent = "Olha só alguém metido a espertinho, ta ficando bom só que ainda é pouco!";
    } else if (score > 120 && score <= 150) {
        finalMessage.textContent = "Tá quase dando gosto de ver, mas ainda acho que se espremer mais um pouco você melhora!";
    } else if (score > 150 && score <= 180) {
        finalMessage.textContent = "Olha, um alguém que eu quase posso considerar um rival, aparentemente anda praticando!";
    } else if (score > 180) {
        finalMessage.textContent = "Muito bem, gostei de ver, alguém que aprecia a matemática como deve ser, pode ser meu discípulo(a)!";
    }

    // Exibir o quadrante "Jogo Finalizado" ao terminar o jogo
    gameOverDiv.classList.remove('hidden');
}

restartButton.addEventListener('click', startGame);

// Iniciar o jogo
startGame();
