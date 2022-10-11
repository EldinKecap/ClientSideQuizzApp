
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
        for (const obj of data) {

            let { category,correctAnswer,incorrectAnswers,question } = obj;
            let htmlQuestion = `<h1>${category}</h1><h3>${question}</h3>`
         

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

async function displayQuestions() {
    let QuestionsArr = await getQuestions();
    let container = document.getElementById('container');
    console.log(QuestionsArr);
    QuestionsArr.forEach(e => {
        container.innerHTML = e.HTMLQuestion
        let answer = e.answer;
       //OVDJE SAM STAO
    });
}





let startButton = document.getElementById('startButton');
console.log(startButton);

startButton.addEventListener('click',()=>{

        displayQuestions();
  
})