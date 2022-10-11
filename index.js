
async function getCategories() {
    try{
    let response = await fetch('https://the-trivia-api.com/api/categories');
    let data = await response.json();
    let category = document.getElementById('category')
        for (const key in data) {
            let option = document.createElement('option');
            option.innerHTML = key; 
            category.appendChild(option)
        }
    }catch(error){
        throw new Error(error)
    } 
}

getCategories();

async function getQuestions() {
    let numberOfQuestions = document.getElementById('numberOfQuestions').value||5;
    let category = document.getElementById('category').value;
    let difficulty = document.getElementById('difficulty').value;
    let htmlQuestionArr = [];
    if (numberOfQuestions > 20 || numberOfQuestions <= 0) {
        let errorLabel = document.querySelector(`label[for='numberOfQuestions']`);
        errorLabel.innerHTML += 'Number is not between 0 and 20' ;
        return;
    }else{
        let url = `https://the-trivia-api.com/api/questions?`;

        if (category != 'all') {

           url = url.concat(`categories=${category.toLowerCase().replace(/&/g,'and').replace(/\s/g,'_')}&`)
        //    console.log(category.toLowerCase().replace(/&/g,'and').replace(/\s/g,'_'))
        }
        url = url.concat(`limit=${numberOfQuestions}`);
        if (difficulty != 'random') {
           url = url.concat(`&difficulty=${difficulty}`)
        }
        // console.log(url);
        let response = await fetch(url);
        let data = await response.json();
        let counter = 1;
        for (const obj of data) {

            let { category,correctAnswer,incorrectAnswers,question } = obj;
            let htmlQuestion = `<h1>${category}</h1><h3 id="question">${counter + '. ' + question}</h3>`;
            counter++;

            let randomAnswerArr = [...incorrectAnswers,correctAnswer].sort((a,b)=>{
                return a.localeCompare(b);
            });

            htmlQuestion += `<p class = "answer">${randomAnswerArr[0]}</p>
            <p class = "answer">${randomAnswerArr[1]}</p>
            <p class = "answer">${randomAnswerArr[2]}</p>
            <p class = "answer">${randomAnswerArr[3]}</p>`;

            htmlQuestionArr.push({'question' : question , HTMLQuestion : htmlQuestion, answer : correctAnswer})
        }    
    }
    
    // console.log(numberOfQuestions,category,difficulty);
    return htmlQuestionArr
}
// localStorage.clear()
async function displayQuestions( questionNumber = 0 ) {
    let questionsArr;
    let correctAnswerCounter ;
    let wrongAnswerCounter ;
    if (questionNumber == 0) {
        questionsArr = await getQuestions();
        localStorage.setItem('questionArr',JSON.stringify(questionsArr));
        correctAnswerCounter = 0;
        wrongAnswerCounter = 0;
        localStorage.setItem('counters',JSON.stringify({correctAnswerCounter,wrongAnswerCounter}))
    }else{
        questionsArr = JSON.parse(localStorage.getItem('questionArr'));     
        console.log(JSON.parse(localStorage.getItem('counters')));  
        let counters = JSON.parse(localStorage.getItem('counters'));
        correctAnswerCounter = counters.correctAnswerCounter;
        wrongAnswerCounter = counters.wrongAnswerCounter;
    }
    // console.log(questionsArr);
    let container = document.getElementById('container');
    try{
        container.innerHTML = questionsArr[questionNumber].HTMLQuestion ;
    }catch{
        container.innerHTML = `<h1>Thank you for playing</h1>
        <h3>Correct Answers:${correctAnswerCounter} <br> Wrong Answers:${wrongAnswerCounter}</h3>
        <a href='./index.html'>Play again</a>`;
    }
    let answerArr = document.querySelectorAll('.answer');
    // console.log(QuestionsArr);
    // console.log(answerArr);
    for (const answer of answerArr) {
        // console.log(answer.innerHTML);
        // console.log(questionsArr[questionNumber].answer);
        answer.addEventListener('click',()=>{
            if (answer.innerHTML === questionsArr[questionNumber].answer) {
                console.log('ayyy');
                answer.style.backgroundColor = 'green';
                correctAnswerCounter++;
                localStorage.setItem('counters',JSON.stringify({correctAnswerCounter,wrongAnswerCounter}))
            }else{
                console.log('nayy');
                answer.style.backgroundColor = 'red';
                wrongAnswerCounter++;
                localStorage.setItem('counters',JSON.stringify({correctAnswerCounter,wrongAnswerCounter}));
            }
           setTimeout(()=>{
               displayQuestions(document.getElementById('question').innerHTML[0]);

           },500)
        })
    }
        
       //OVDJE SAM STAO
    
}





let startButton = document.getElementById('startButton');
// console.log(startButton);

startButton.addEventListener('click',()=>{
        
            displayQuestions();  
  
})