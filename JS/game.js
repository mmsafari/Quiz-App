const question=document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice-text"));
const scoreText=document.getElementById('score');
let progressText=document.getElementById('progressText');
let progressBarFull=document.getElementById('progressBarFull');
const loader = document.getElementById("loader");
const game = document.getElementById("game");


let currentQuestion= {};
let acceptingAnswers=false;
let score=0;
let questionCounter=0;
let availableQuestions= [];


let questions=[];
fetch('https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        //questions = loadedQuestions;
        
        console.log(loadedQuestions.results);
        questions =loadedQuestions.results.map(loadedQuestions =>{
           const formattedQuestion ={
              question:loadedQuestions.question
           };

           const answerChoise =[...loadedQuestions.incorrect_answers];
           //random_index
           formattedQuestion.answer =Math.floor(Math.random()*3) + 1 ;
           answerChoise.splice(formattedQuestion.answer -1 ,0,
            loadedQuestions.correct_answers);

            answerChoise.forEach((choice,index)=>{
               formattedQuestion["choice"+(index+1)] = choice;
            })
            return formattedQuestion;
        });
        
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//constants
const CORRECT_BONUS=10;
const MAX_QUESTION=3;

startGame = () => {
   questionCounter=0;
   availableQuestions=[...questions];
   score=0;
   getNewQuestion();
   game.classList.remove('hidden');
   loader.classList.add("hidden");

}
getNewQuestion = () => {
   if(availableQuestions.length===0 || questionCounter >= MAX_QUESTION)
   {
      localStorage.setItem("mostRecentScore" , score);
      return window.location.assign('../HTML/end.html');
   }

   questionCounter++;
   progressText.innerText="Question "+questionCounter + '/' + MAX_QUESTION;
   //progressbar update
 
   progressBarFull.style.width=`${(questionCounter / MAX_QUESTION) * 100}%`;
   
   
   const questionIndex = Math.floor(Math.random() * availableQuestions.length);
   
   currentQuestion = availableQuestions[questionIndex];
   question.innerText = currentQuestion.question;

   choices.forEach((choice) => {
      const number = choice.dataset['number'];
      choice.innerText = currentQuestion['choice' + number];
   });
   
   availableQuestions.splice(questionIndex , 1);
   acceptingAnswers = true;

};

choices.forEach((choice) => {
   choice.addEventListener('click',(e)=>{

      if(!acceptingAnswers)
         return;

      acceptingAnswers = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset['number'];

      let classToApply = 'incorrect';
      if(selectedAnswer==currentQuestion.answer){
         classToApply = 'correct';
      }
      
      if(classToApply === 'correct'){
         increamentScore(CORRECT_BONUS);
      }
      selectedChoice.parentElement.classList.add(classToApply);

      setTimeout(()=>{
         selectedChoice.parentElement.classList.remove(classToApply);
         getNewQuestion();
      },1000);
      


   });
});
increamentScore= num => {
   score +=num;
   scoreText.innerText=score;
}