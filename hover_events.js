const questionsBlock = document.querySelector('.questions-block');

// add pointerover hover effect for every answer container
questionsBlock.addEventListener('pointerover', answerPointerOver);

// pointerover hover effect function for every answer container
function answerPointerOver(event){
    let answer = event.target.closest('.answer');

    if (!answer) return;
    if (answer.classList.contains('answer-disabled')) return;

    // adding class to answer container
    answer.classList.add('answer-hover');

    // adding class to answer-order
    answer.querySelector('.answer-order').classList.add('answer-order-hover');
}

// add pointerout hover effect for every answer container

questionsBlock.addEventListener('pointerout', answerPointerOut);

// pointerout hover effect function for every answer container
function answerPointerOut(event){
    let answer = event.target.closest('.answer');

    if (!answer) return;

    // removing hover class
    answer.classList.remove('answer-hover');
    answer.querySelector('.answer-order').classList.remove('answer-order-hover');

}


