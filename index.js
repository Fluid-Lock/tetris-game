document.addEventListener('DOMContentLoaded', () => {

const grid = document.querySelector('.container');
let squares = Array.from(document.querySelectorAll('.container div'));
const width = 10;
const ScoreDisplay = document.querySelector('#score');
const StartBtn = document.querySelector('#start-button');
let nxtRandom = 0;
let timerID;
let score = 0;


const lTetro = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetro = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
]

const tTetro = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
]

const oTetro = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]

]

const iTetro = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const Tetros = [lTetro, zTetro, tTetro, oTetro, iTetro]

let random = Math.floor(Math.random()*Tetros.length);
let currentPosition = 4;
let currentRotation = 0;
let current = Tetros[random][currentRotation];

console.log(Tetros[random][0]);

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetro');
    })
}

function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetro');
    })
}



function control(e) {
    if(e.keyCode === 37 && timerID!=null) {
        moveLeft()
    }

    if(e.keyCode === 39 && timerID!=null ) {
        moveRight()
    }

    if(e.keyCode === 38 && timerID!=null ) {
        Rotate();
        console.log(currentPosition);

    }

    if(e.keyCode === 40 && timerID!=null) {
        moveDown()
    }


}

document.addEventListener('keydown', control);


function moveDown() {
    undraw();
    currentPosition+= width;
    draw();
    freeze();
}


function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))

        random = nxtRandom;
        nxtRandom = Math.floor(Math.random() * Tetros.length);
        current = Tetros[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

function moveLeft() {
    undraw();
    const isAtLeft = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeft) currentPosition -=1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
      }
    
    draw();
    
}

function moveRight() {
    undraw();
    const isAtRight = current.some(index => (currentPosition + index) % width === width - 1)

    if(!isAtRight) currentPosition +=1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
      }
    
    draw();
    
}

function Rotate() {
    undraw();
    currentRotation++;
    if(currentRotation === current.length) {
        currentRotation = 0;
    }

    current = Tetros[random][currentRotation];

    draw();
}


const displaySquares = document.querySelectorAll('.nxtContainer div');
const displayWidth = 6;
let displayIndex = 0;

const nextTetros = [
    [2, displayWidth+2, displayWidth*2+2, 3],
    [2, displayWidth+2, displayWidth+3, displayWidth*2+3],
    [displayWidth+2, displayWidth*2+1, displayWidth*2+2, displayWidth*2+3],
    [displayWidth+2, displayWidth+3, displayWidth*2+2, displayWidth*2+3],
    [2, displayWidth+2, displayWidth*2+2, displayWidth*3+2]
  ]

  function displayShape() {
      displaySquares.forEach(squares => {
          squares.classList.remove('tetro2');
      })
      nextTetros[nxtRandom].forEach(index => {
          displaySquares[displayIndex + index].classList.add('tetro2');
      })
  }


  StartBtn.addEventListener('click', () => {
      if (timerID) {
          clearInterval(timerID)
          timerID = null;
      }
      else {
          draw();
          timerID = setInterval(moveDown, 1000);
          nxtRandom = Math.floor(Math.random()*Tetros.length);
          displayShape();
      }
  })


  function addScore() {
      for (let i =0; i <199; i += width) {
          const row =[i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      
            let scoring = score;

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            ScoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetro');
            })

            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }

        let scored = score;

        if(scored-scoring == 30) {
            document.getElementById('triple').style.display = "block";
            console.log("YES");
        }

        
    }
  }

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        ScoreDisplay.innerHTML = 'end';
        clearInterval(timerID);
    }
}


})