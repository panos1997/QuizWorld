

// data for options
data = {
    amount: 2,
    category: 9,
    difficulty: "easy"
}



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


questions = [];
questionClassList = [];
currentQuestion = 0;
currentChecked = false;
score = 0;

document.querySelector('.btn-success').addEventListener('click', async (event) => {

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

});


document.querySelector('#nextDiv').addEventListener('click', (event) => {
   
    console.log("TARGET: " + event.target.closest('#next'));   
    console.log("currIndex: " + currentQuestion +", questionClassList.length: " + questionClassList.length);   
   
    // render next question (if there is one) 

    if(currentQuestion < questionClassList.length - 1) {
        // update current question index
        
        currentQuestion++;
        currentChecked = false;
        

        // check if the element clicked is the 'next' button
        if(event.target.closest('#next').id = "#next") {
    
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

});  


document.querySelector('.selectpicker').addEventListener('change', (event) => {
    
    // get number of questions and store it in the data object
    var amountOptions = event.target.options;
    data.amount = amountOptions[amountOptions.selectedIndex].textContent.split(' ')[0];
});


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

// check answer
document.querySelector('body').addEventListener('click', (event) => {
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
            document.querySelector('#nextDiv').parentElement.removeChild(document.querySelector('#nextDiv'));
        }
       
        
        
    }
});


function playWinAudio() {
    
    var snd = new Audio("win.wav"); // buffers automatically when created
    snd.play();

    setTimeout(function(){
        snd.pause();
    },
    1500);    
}


function playLoseAudio() {
    
    var snd = new Audio("lose.wav"); // buffers automatically when created
    snd.play();

    setTimeout(function(){
        snd.pause();
    },
    1500);    
}