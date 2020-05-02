

// data 

var data = {
    amount: 2,
    category: 9,
    difficulty: "easy"
}

var questions = [];
var questionClassList = [];
var currentQuestion = 0;
var currentChecked = false;
var score = 0;

// initialize audios
var win = new Audio("win.wav"); // buffers automatically when created
var lose = new Audio("lose.wav"); // buffers automatically when created



class Options {

    constructor(amount, category, difficulty) {
        this.amount = amount;
        this.category = category;
        this.difficulty = difficulty;
    }

    async getQuestions() {

        const res = await (await fetch(`https://opentdb.com/api.php?amount=${this.amount}&category=${this.category}&difficulty=${this.difficulty}&type=multiple`)).json();

        //console.log(res);

        return res;

    }

}

class Question {

    constructor(question, answer1, answer2, answer3, answer4, correctAnswer) {
        this.question = question;
        this.answer1 = answer1;
        this.answer2 = answer2;
        this.answer3 = answer3;
        this.answer4 = answer4;
        this.correctAnswer = correctAnswer;
    }

    renderQuestion() {

        const questionCard = `
            <h2 id="scoreHeader"> Your Score: <span id="score">  </span>
            </h2>
            <div class="container-fluid bg-info">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><span class="label label-warning" id="qid"></span>${this.question}</h3>
                </div>
                <div class="modal-body">
                    <div id="loadbar" style="display: none;">
                        <div class="blockG" id="rotateG_01"></div>
                        <div class="blockG" id="rotateG_02"></div>
                        <div class="blockG" id="rotateG_03"></div>
                        <div class="blockG" id="rotateG_04"></div>
                        <div class="blockG" id="rotateG_05"></div>
                        <div class="blockG" id="rotateG_06"></div>
                        <div class="blockG" id="rotateG_07"></div>
                        <div class="blockG" id="rotateG_08"></div>
                    </div>

                <div class="quiz" id="quiz" data-toggle="buttons">
                <label class="element-animation1 btn btn-lg btn-primary btn-block choice"><span class="btn-label"><i class="glyphicon glyphicon-chevron-right"></i></span> <input type="radio" name="q_answer" value="1">${this.answer1}</label>
                <label class="element-animation2 btn btn-lg btn-primary btn-block choice"><span class="btn-label"><i class="glyphicon glyphicon-chevron-right"></i></span> <input type="radio" name="q_answer" value="2">${this.answer2}</label>
                <label class="element-animation3 btn btn-lg btn-primary btn-block choice"><span class="btn-label"><i class="glyphicon glyphicon-chevron-right"></i></span> <input type="radio" name="q_answer" value="3">${this.answer3}</label>
                <label class="element-animation4 btn btn-lg btn-primary btn-block choice"><span class="btn-label"><i class="glyphicon glyphicon-chevron-right"></i></span> <input type="radio" name="q_answer" value="4">${this.answer4}</label>
            </div>
            </div>
            <div class="modal-footer text-muted">
            <span id="answer"></span>
            </div>
            </div>
            </div>
            </div>

        `;

        const nextBtn = `
        <button id="next" type="button" class="btn btn-huge btn-success">Next<span id="icon">  <i class="fa fa-arrow-circle-right"></i> </span> </button>
        `;

        
        // if there is a previous card, remove it first
        if(document.querySelector('.container-fluid') !== null) {
            document.querySelector('.container-fluid').parentElement.removeChild(document.querySelector('.container-fluid'));
        }

        // and then add new question card
        document.querySelector('body').insertAdjacentHTML('beforeend', questionCard);

        // add next button
        if(document.querySelector('#nextDiv') !== null) {
            document.querySelector('#nextDiv').innerHTML = "";
            document.querySelector('#nextDiv').insertAdjacentHTML('beforeend', nextBtn);
        } else {
            const nextDiv = `
            <div id="nextDiv"> 
                <button id="next" type="button" class="btn btn-huge btn-success" style=" margin-left: 46.7%; margin-top: 10px;">Next<span id="icon">  <i class="fa fa-arrow-circle-right"></i> </span> </button>
            </div>
            `;

            document.querySelector('body').insertAdjacentHTML('beforeend', nextDiv);

        }
        

    }

}

var startFunc = async (event) => {

    // Get questions
    console.log('data: ' + data);
    var response = await new Options(data.amount, data.category, data.difficulty).getQuestions();

    //console.log('response str: ' + JSON.stringify(response.results));

    //console.log('response json: ' + response.results[0].question);

    
    // create questions 
    questions = Object.keys(response).map( (key, index) => {
        return response[key];
    });

    questions = questions[1];
    //console.log("questions: " + JSON.stringify(questions));

    questions.forEach( (q, index) => {
        console.log(index + ": " + JSON.stringify(q));

        var title = q.question;
        var incorrectAnswers = q.incorrect_answers;
        var correctAnswer = q.correct_answer;
        var category = q.category;
    
        var totalAnswers = [correctAnswer, ...incorrectAnswers];
    
        // index = 0-3 for multiple choice questions (they have 4 answers)
        var indexCorrect = Math.floor(Math.random() * totalAnswers.length);
        console.log('indexCorrect: ' + indexCorrect)
    
        Array.prototype.move = function (from, to) {
            this.splice(to, 0, this.splice(from, 1)[0]);
        };
    
        totalAnswers.move(0,indexCorrect);
    
        console.log(`
            title: ${title} \n
            incorrectAnswers: ${incorrectAnswers} \n
            correctAnswer: ${correctAnswer} \n
            category: ${category} \n 
            totalAnswers: ${totalAnswers}
        `);
    
        var question = new Question(title, ...totalAnswers, correctAnswer);
        questionClassList.push(question);
    });

    console.log("questionClassList: " + questionClassList);


    // clear screen
    document.querySelector('.jumbotron-fluid').innerHTML = "";


    // add question to the UI
    questionClassList[0].renderQuestion();

};

var nextFunc = (event) => {
   
    console.log("TARGET: " + event.target.closest('#next'));   
    console.log("currIndex: " + currentQuestion +", questionClassList.length: " + questionClassList.length);   
   
    // render next question (if there is one) 

    if(currentQuestion < questionClassList.length - 1) {
        // update current question index
        
        currentQuestion++;
        currentChecked = false;
        

        // check if the element clicked is the 'next' button
        if(event.target.closest('#next').id = "#next") {

            // stop winning and losing sounds
            win.pause();
            lose.pause();

            win = new Audio("win.wav"); // buffers automatically when created
            lose = new Audio("lose.wav"); // buffers automatically when created
    
            console.log('event on the right button');
            
            // clear screen
            document.querySelector('.container-fluid').innerHTML = "";
            
            // add question to the UI
            questionClassList[currentQuestion].renderQuestion();

        }   
    } 
    // if all the questions are finished
    else if(currentQuestion === questionClassList.length)  {
        console.log('game is finished');
    }

}

var checkAnswer = (event) => {
    //console.log(event.target.classList.contains('choice'));
    
    if(event.target.classList.contains('choice') && currentChecked === false) {

        var userAnswer = event.target.lastChild.textContent;

        // check if the given answer is correct
        if(userAnswer === JSON.stringify(questionClassList[currentQuestion].correctAnswer).replace(/["]/g, "")) {
            console.log('correct!!! :)');

            playWinAudio();

            score++;

            event.target.style.backgroundColor = "#2ecc71";

        } else {
            console.log('wrong!!! :(');

            playLoseAudio();
        
            event.target.style.backgroundColor = "#c0392b";
        }

        document.querySelector('#score').textContent = `${score}/${data.amount}`;
        currentChecked = true;

    };

    console.log(currentQuestion);
    console.log(data.amount);
    console.log(currentChecked);

    if(currentQuestion === data.amount - 1 && currentChecked === true) {
        
        console.log(Math.floor((data.amount - 1) / 2 + 1));
        if(score >= Math.floor((data.amount - 1) / 2 + 1)) {
            document.querySelector('#score').style.color = "#2ecc71";
        } else {
            document.querySelector('#score').style.color = "#c0392b";
        }

        if(document.querySelector('#nextDiv') !== null) {
            if(document.querySelector('#next') !== null) {
                document.querySelector('#next').parentElement.removeChild(document.querySelector('#next'));
            }
            
            document.querySelector("#nextDiv").innerHTML = `
            <button id="playAgain" type="button" class="btn btn-huge">Play Again<span id="icon">  </span> </button>
            `;
        }
       
        
        
    }
};

var playAgain = (event) => {
    
    console.log('-------------');
    console.log(event.target);
    console.log(event.target.closest('#playAgain'));
    console.log('-------------');


    // if user wants to play again
    if(event.target.id === 'playAgain') {
        console.log('play again clicked');

        // stop winning and losing sounds
        win.pause();
        lose.pause();

        win = new Audio("win.wav"); // buffers automatically when created
        lose = new Audio("lose.wav"); // buffers automatically when created


        // clear screen
        document.querySelector('body').innerHTML = "";
        document.querySelector('body').innerHTML = indexBody;

        // restore event listeners for next round
        document.querySelector('.btn-success').addEventListener('click', startFunc);
        document.querySelector('#nextDiv').addEventListener('click', nextFunc);  
        document.querySelector('body').addEventListener('click', checkAnswer);
        categoryClick();
        document.querySelector('#nextDiv').addEventListener('click', playAgain);
        document.querySelector('.selectpicker').addEventListener('change', selectAmount);
        levelClick();



        // delete saved data
        questions = [];
        questionClassList = [];
        currentQuestion = 0;
        currentChecked = false;
        score = 0;

        data.amount = 2;
        data.category = 9;
        data.difficulty = "easy";


    }
}

var selectAmount = (event) => {
    
    // get number of questions and store it in the data object
    var amountOptions = event.target.options;
    data.amount = amountOptions[amountOptions.selectedIndex].textContent.split(' ')[0];
};


function levelClick() {
    Array.from(document.querySelectorAll('.level')).forEach( (btn) => {
        
        btn.addEventListener('click', (event) => {

            if(btn.style.backgroundColor === "white") {
                btn.style.backgroundColor = "";

            } else {
                btn.style.backgroundColor = "white";
                data.difficulty = btn.textContent;
                
                Array.from(document.querySelectorAll('.level')).forEach( (btn2) => {
                    if(btn2 != btn) {
                        btn2.style.backgroundColor = "";
                    }
                });
                
            }
        });
    });
};


function categoryClick() {
    
        Array.from(document.querySelectorAll('.category')).forEach( (btn) => {
        
        btn.addEventListener('click', (event) => {

            if(btn.style.backgroundColor === "white") {
                btn.style.backgroundColor = "";

            } else {
                btn.style.backgroundColor = "white";
                data.category = parseInt(btn.dataset.value);
                
                Array.from(document.querySelectorAll('.category')).forEach( (btn2) => {
                    if(btn2 != btn) {
                        btn2.style.backgroundColor = "";
                    }
                });
                
            }
        });
    });
}





//////////////////////             SET EVENT LISTENERS FOR THIS ROUND

document.querySelector('.btn-success').addEventListener('click', startFunc);

document.querySelector('#nextDiv').addEventListener('click', nextFunc);  

document.querySelector('body').addEventListener('click', checkAnswer);

categoryClick();

document.querySelector('#nextDiv').addEventListener('click', playAgain);

document.querySelector('.selectpicker').addEventListener('change', selectAmount);

levelClick();

/////////////////////////////




var indexBody = `
<div class="jumbotron-fluid">
<div class="container-fluid special stripes">
  <div class="container push-down mx-auto">
    <h1 class="jumbotron-heading text-white text-center" style="font-size:60px;"> 
      <span style="color: #e67e22;">Q</span><span style="color: #f1c40f;">u</span><span style="color: #e67e22;">i</span><span style="color: #f1c40f;">z</span><span style="color: #e67e22;">W</span><span style="color: #f1c40f;">o</span><span style="color: #e67e22;">r</span><span style="color: #f1c40f;">l</span><span style="color: #e67e22;">d</span> 
   </h1>
      <h3 class="jumbotron-heading text-white text-center" style="font-size:40px;"> 
          Let's Test Your Knowledge </h3>
    <p class="lead text-white text-center mx-auto" style="width: 60%; font-size:22px;">Please, select the <span style="color:#f1c40f">number of questions</span>. <br>

      <select class="selectpicker" style="background-color: #dfe6e9; border: none;">
          <option>2 Questions</option>
          <option>5 Questions</option>
          <option>10 Questions</option>
          <option>15 Questions</option>
          <option>20 Questions</option>
      </select>

      <p class="lead text-white text-center mx-auto" style="width: 60%; font-size:22px;" class=" ">Please, select a <span style="color:#f1c40f">category</span>. <br>

      <div class="row justify-content-center" style="margin-bottom: 20px;">
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:220px;" data-value="9">General knowledge</a>
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:140px;" data-value="11">Film</a>
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:140px;" data-value="12">Music</a>
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:150px;" data-value="15">Video games</a>
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:150px;" data-value="19">Mathematics</a>
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:140px;" data-value="21">Sports</a>
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:140px;" data-value="22">Geography  </a>
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:140px;" data-value="23">History</a>
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:140px;" data-value="24">Politics</a>
          <a class="btn btn-outline-light m-1 category" style="font-size:x-large; width:140px;" data-value="26">Celebrities</a>
      </div>
        
      <p class="lead text-white text-center mx-auto" style="width: 60%; font-size:22px;" class=" ">Please, select the <span style="color:#f1c40f">difficulty</span> level. <br>

      <div class="row justify-content-center">
        <a class="btn btn-outline-light m-1 level" style="font-size:x-large; width:107px;">easy</a>
        <a class="btn btn-outline-light m-1 level" style="font-size:x-large; width:107px;">medium</a>
        <a class="btn btn-outline-light m-1 level" style="font-size:x-large; width:107px;">hard</a>
      </div>

      
      
      
      <button type="button" class="btn btn-huge btn-success" style="font-size:x-large;">Start the Quiz </button>
  </div>
</div>
<!--   /container  -->
</div>

<div id="nextDiv" style="font-size: x-large; margin-left: 44.1%; position: absolute; margin-top: 430px;" >
<!--   here the next button will be placed  -->
</div>

`;




// Audios for correct and wrong answer

function playWinAudio() {
    
    win.play();

    setTimeout(function(){
        win.pause();
    },
    2500);    
}


function playLoseAudio() {
    
    lose.play();

    setTimeout(function(){
        lose.pause();
    },
    2500);    
}