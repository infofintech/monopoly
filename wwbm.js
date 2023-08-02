//import QuestionsSets from './questions_sets.json' assert {type: 'json'};
import Questions from './questions.json' assert {type: 'json'};

const question = document.querySelector('.question-content');
const answers = document.querySelectorAll('.answer-content');
const answersBlock = document.querySelector('.answers-block');
const stepsList = Array.from(document.querySelectorAll('.steps-list > ul > li')).reverse();
const round = document.querySelector('.round-content');
const withdraw = document.querySelector('.withdraw');
const btnHalf = document.querySelector('#btnHalf');
const btnHallAssistance = document.querySelector('#btnHallAssistance');
const btnCallFriend = document.querySelector('#btnCallFriend');
const timer = document.querySelector('.timer > span');

const prizes = [100, 200, 300, 500, 1000, 2000, 4000, 8000,
    16000, 32000, 64000, 125000, 250000, 500000, 1000000];

newGame();

function newGame(){
    let step = 0;
    let currentPrize = 0;
    let safePrize = 0;

    // choosing random question
    let randomQuestion = Math.floor(Math.random() * Questions[step].length);

    // choosing which questions set
    // const questionSet = QuestionsSets[randomNum];

    // according initial question
    nextQuestion(step);

    // initial round
    round.innerHTML = "1";

    // highlighting first step
    addHighLightStepList(step);

    // adding click event to every answer
    answersBlock.addEventListener('click', checkAnswer);

    // adding click event to withdraw button
    withdraw.onclick = takeMoney;

    function takeMoney(){
        if (confirm("Do you really want to take money?")){
            finishGame("take");
        }
    }
    function checkAnswer(event){
        let answer = event.target.closest('.answer');

        if (!answer) return;

        // if answer is disabled return
        if (answer.classList.contains('answer-disabled')) return;

        // clearing timer interval
        endTimer();


        // covering the entire page to not click while answer is checking
        let background = document.createElement('div');
        background.classList.add('help-background');
        background.style.opacity = 0;
        document.body.append(background);

        addHighLightAnswer(answer);

        setTimeout(() => {
            addHighLightCorrectAnswer(step);
        }, 1500);

        setTimeout(() => {
                removeHighLightAnswer(answer);

                background.remove();

                //starting timer
                startTimer();

                // enable answers that was disabled
                enableAnswers();

                // if answer is correct
                if (Questions[step][randomQuestion].correctAnswer === answer.dataset.order){
                    isCorrect();
                }
                // if is wrong
                else {
                    isWrong();
                }
            }
            , 3000
        );
    }

    function isCorrect(){
        gainPrize(step);

        if (step < 14){
            nextStep();
        } else{
            finishGame('win');
        }
    }

    function isWrong(){
        finishGame('lose');
    }

    function finishGame(result){
        switch(result){
            case 'win':
                alert(`Congratulations!!! You won ${currentPrize} dollars`);
                break;

            case 'take':
                alert(`You took money. You won ${currentPrize} dollars`);
                break;

            case 'lose':
                alert(`You lost! You won ${safePrize} dollars`);
                break;
            case 'timeOut':
                alert(`Timeout! You won ${safePrize} dollars`);
        }
        // removing click event listeners
        answersBlock.removeEventListener('click', checkAnswer);

        btnHalf.removeEventListener('click', halfAnswers);
        btnHallAssistance.removeEventListener('click', askCommunity);
        btnCallFriend.removeEventListener('click', callFriend);

        // enable answers that was disabled
        enableAnswers();

        // disabling timer
        disableTimer();
        endTimer();

        // enable help buttons
        enableHelpBtns();

        removeHighlightStepList(step);

        // starting new game
        newGame();
    }

    function nextStep(){
        step++;

        round.innerHTML = `${step+1}`;

        nextQuestion(step);
        nextHighlightStepList(step);
    }

    function nextQuestion(_step){
        randomQuestion = Math.floor(Math.random() * Questions[step].length);
        question.innerHTML = Questions[step][randomQuestion]["question"];

        for (let i = 0; i < answers.length; i++){
            let answer = answers[i];
            answer.innerHTML = Questions[step][randomQuestion]["answers"][i];
        }
    }

    function gainPrize(_step){
        currentPrize = prizes[_step];
        if (currentPrize === 1000 || currentPrize === 32000)
            safePrize = currentPrize;
    }

    function nextHighlightStepList(_step){
        // removing highlight for the previous step
        removeHighlightStepList(_step-1);

        // adding highlight for next step
        addHighLightStepList(_step);
    }

    function removeHighlightStepList(_step){
        stepsList[_step].classList.remove('current');
    }
    function addHighLightStepList(_step){
        stepsList[_step].classList.add('current');
    }

    function addHighLightAnswer(_answer){
        // adding class to answer container
        _answer.classList.add('answer-chose');

        // adding class to answer-order
        _answer.querySelector('.answer-order').classList.add('answer-order-chose');
    }
    function addHighLightCorrectAnswer(_step){
        for (let answer of answers){
            if (Questions[step][randomQuestion]["correctAnswer"] === answer.parentElement.dataset.order){
                answer.parentElement.classList.add('answer-correct');
            }
        }
    }

    function removeHighLightAnswer(_answer){
        // remove highlight for chose answer
        _answer.classList.remove('answer-chose', 'answer-correct');
        _answer.querySelector('.answer-order').classList.remove('answer-order-chose');

        // remove highlight for correct answer
        for (let answer of answers){
            if (Questions[step][randomQuestion]["correctAnswer"] === answer.parentElement.dataset.order){
                answer.parentElement.classList.remove('answer-correct');
            }
        }
    }

    function getCorrectAnswer(){
        for (let answer of answers){
            if (Questions[step][randomQuestion]["correctAnswer"] === answer.parentElement.dataset.order){
                return answer;
            }
        }
    }

    btnHalf.addEventListener('click', halfAnswers);

    function halfAnswers(){
        // disabling button after one click in every new game
        btnHalf.removeEventListener('click', halfAnswers);

        disableBtn(btnHalf);

        let correctAnswer = getCorrectAnswer();

        function getRandomAnswer() {
            while(true){
                let randNum = Math.floor(Math.random() * 4);
                if (answers[randNum] !== correctAnswer)
                    return answers[randNum];
            }
        }
        let answer1 = getRandomAnswer();
        answer1.innerHTML = "";

        let answer2;
        while(true){
            answer2 = getRandomAnswer();
            if (answer1 !== answer2) break;
        }
        answer2.innerHTML = "";

        disableAnswers(answer1.parentElement, answer2.parentElement);
    }

    function disableAnswers(...args){
        for (let answer of args){
            answer.classList.add('answer-disabled');
        }
    }
    function enableAnswers(){
        for (let answer of answers){
            answer.parentElement.classList.remove('answer-disabled');
        }
    }
    function disableBtn(btn){
        btn.classList.add('disabled-btn');
    }
    function enableHelpBtns(){
        btnHalf.classList.remove('disabled-btn');
        btnHallAssistance.classList.remove('disabled-btn');
        btnCallFriend.classList.remove('disabled-btn');
    }

    function createContainer(title){
        let background = document.createElement('div');
        background.classList.add('help-background');
        document.body.append(background);

        let container = document.createElement('div');
        container.classList.add('help-container');
        background.append(container);

        let containerTitle = document.createElement('p');
        containerTitle.classList.add('help-container-title');
        containerTitle.innerText = title;
        container.append(containerTitle);

        let containerInner = document.createElement('div');
        containerInner.classList.add('help-container-inner');
        container.append(containerInner);

        let btnContinue = document.createElement('button');
        btnContinue.classList.add('help-container-continue');
        btnContinue.innerHTML = 'Continue';
        container.append(btnContinue);

        btnContinue.onclick = () => {
            background.remove();
        }

        btnContinue.onpointerenter = () => {
            btnContinue.classList.add('help-container-continue-hover');
        }
        btnContinue.onpointerleave = () => {
            btnContinue.classList.remove('help-container-continue-hover');
        }

        return containerInner;
    }

    btnHallAssistance.addEventListener('click', askCommunity);

    function askCommunity(){
        btnHallAssistance.removeEventListener('click', askCommunity);

        disableBtn(btnHallAssistance);

        let containerInner = createContainer('Hall assistance');

        let correctAnswer = getCorrectAnswer();

        let hundredPercents = 100;

        let correctAnsPercents;
        let correctAnsGraph;

        let graphColors = ['blue', 'red', 'green', 'purple'];

        for (let i = 0; i < answers.length; i++){
            // if is active 50/50
            if (answers[i].innerHTML === "") continue;

            let ansOrder = answers[i].previousElementSibling.innerHTML.slice(0,1);

            let column = document.createElement('div');
            column.classList.add('help-container-inner-column');
            containerInner.append(column);

            let graph = document.createElement('div');
            graph.classList.add('help-container-graph');
            graph.style.background = graphColors[i];
            column.append(graph);

            let percents = document.createElement('div');

            if (answers[i] !== correctAnswer){
                let randNum = Math.round(Math.random() * 20 * 10)/10 + 10;
                percents.innerHTML = `${randNum} %`;
                hundredPercents -= randNum;

                graph.style.height = `${randNum * 3}px`;
            } else {
                correctAnsPercents = percents;
                correctAnsGraph = graph;
            }

            column.append(percents);

            column.append(ansOrder);

        }

        correctAnsPercents.innerHTML = `${Math.round(hundredPercents * 10)/10} %`;
        correctAnsGraph.style.height = `${hundredPercents * 3}px`;
    }

    btnCallFriend.addEventListener('click', callFriend);

    function callFriend(){
        btnCallFriend.removeEventListener('click', callFriend);

        disableBtn(btnCallFriend);

        let containerInner = createContainer('Call to friend');

        let randNum = Math.floor(Math.random() * 7);

        let correctAnswerOrder = getCorrectAnswer().previousElementSibling.innerHTML.slice(0,1);

        let possibleAnswers = [`Prietenul tau spune: "Serios? Noi am terminat aceeasi scoala?! Desigur raspunsul este <<${correctAnswerOrder}>>!"`,
        `Prietenul tau spune: "Esti sigur ca tu ai citit intrebarea corect? Fiindca daca avea sa citesti normal, avea sa stii ca raspunsul corect eveident este <<${correctAnswerOrder}>>."`,
        `Prietenul tau spune: "Ha-ha! Dar eu credeam ca tu stii totul. Chiar si eu stiu ca raspunsul corect este <<${correctAnswerOrder}>>."`,
        `Prietenul tau spune: "Vau, eu intotdeauna glumeam ca tu esti un idiot, si acuma tu ai demonstrat asta! Raspunsul corect este <<${correctAnswerOrder}>>. Cum tu puteai sa nu stii?."`,
        `Prietenul tau spune: "Salut, eu am citit ceva despre asta recent si sunt sigur ca raspunsul corect este <<${correctAnswerOrder}>>."`,
        `Prietenul tau spune: "Tu cu siguranta ai intrebat prietenul potrivit! <<${correctAnswerOrder}>> este raspunsul corect. Sunt sigur."`,
            `Prietenul tau spune: "Salut, eu am citit ceva despre asta recent si sunt sigur ca raspunsul corect este <<B>>."`]

        let containerInnerText = document.createElement('div');
        containerInnerText.classList.add('help-container-inner-text');
        containerInner.append(containerInnerText);

        containerInnerText.innerText = possibleAnswers[randNum];
    }

    // setting timer
    let timerInterval;

    let sec = 60;
    timer.innerHTML = `${sec}`;

    function startTimer(){
        timerInterval = setInterval(updateTimer,1000);
        timer.parentElement.style.visibility = 'visible';
        sec = 60;
        timer.innerHTML = `${sec}`;
    }
    function updateTimer(){
        sec--;
        timer.innerHTML = `${sec}`;
        if (sec <= 0) finishGame('timeOut');
    }
    function endTimer(){
        clearInterval(timerInterval);
    }
    function disableTimer(){
        timer.parentElement.style.visibility = `hidden`;
    }
}

let file = new File([Questions], "questions.txt", {
    type: "text/plain"
});

let link = document.querySelector('#link');

link.download = file.name;

link.href = URL.createObjectURL(file);
link.onclick = () => {
    URL.revokeObjectURL(link.href);
};


