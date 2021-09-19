  document.addEventListener("DOMContentLoaded", () => {

squares = document.querySelectorAll(".grid div")
score = document.querySelector("#score")
text = document.querySelector("#text")
// width of gameboard
let width = 15
//array of invaders shot
let takenDownArray = []
//direction of invaders
let direction = 1
//player position
let playerCurrentIndex = 202
//array of invaders
let invaderArray = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32 ,33, 34 ,35, 36, 37 ,38, 39
]

//map array into invader class
invaderArray.forEach(index => {
    squares[index].classList.add("invader")
});

function invaderMove() {

    //left edge of gameboard
    leftEdge = invaderArray[0] % width == 0
    //right edge of gameboard
    rightEdge = (invaderArray[invaderArray.length-1]+1) % width == 0

    //move down if at edge
    if ((leftEdge && direction == -1) || (rightEdge && direction < width)) {
        direction = width
    //after moving one square forward move sideways again 
    } else if (leftEdge && direction == width) {
        direction = 1
    } else if (rightEdge && direction == width) {
        direction = -1
    }

    //remove invader class simulating invader moving away
    invaderArray.forEach(element => {
        squares[element].classList.remove("invader")
    })

    //add direction to the array 
    invaderArray.forEach((element,index) => {
        invaderArray[index]+=direction;
    })

    //map array into div sumulating invader moved 
    invaderArray.forEach((element,index) => {
        if (!takenDownArray.includes(index)) {
            squares[element].classList.add("invader")
        } 
    })

    //if invader reaches the bottom then game is over
    if ((invaderArray[0] > 200) ||
    squares[playerCurrentIndex].classList.contains("invader")) {
    text.textContent = "Game Over! click to try again"
    text.addEventListener('click',() => {
        location.reload()
    })
    clearInterval(invaderId)

    //if all the invaders are taken down, you win
}   else if (takenDownArray.length == invaderArray.length) {
    text.textContent = "You Win!"
    text.addEventListener('click',() => {
        location.reload()
    })
    clearInterval(invaderId)
} 
}

//map player array into div
squares[playerCurrentIndex].classList.add("player")

function playerMove(e) {
    
    //movement of player if not at the edge
    squares[playerCurrentIndex].classList.remove("player")
    if (e.key == "ArrowLeft" && (playerCurrentIndex % width !== 0)) {
        playerCurrentIndex-=1
    //if down arrow is press and snake is not moving up
    } else if (e.key == "ArrowRight" && (playerCurrentIndex+1) % width != 0) {
        playerCurrentIndex+=1
    }
    squares[playerCurrentIndex].classList.add("player")
}

//shooting
function shoot(e) {
    
    
    let laserTimer
    let laserCurrentPosition = playerCurrentIndex

    
    function laser() {

        //simulate explosion 
        function boom() {
            squares[laserCurrentPosition].classList.remove("laser")
            squares[laserCurrentPosition].classList.add("boom")
            setTimeout(() => {
            squares[laserCurrentPosition].classList.remove("boom")
            }, 100);
            clearInterval(laserTimer)
        }

        //simulate laster moving
        squares[laserCurrentPosition].classList.remove("laser")
        laserCurrentPosition -= width
        squares[laserCurrentPosition].classList.add("laser")

        //if laser hits invader, explodes
        if (squares[laserCurrentPosition].classList.contains("invader")) {
            squares[laserCurrentPosition].classList.remove("invader")
            takenDown = invaderArray.indexOf(laserCurrentPosition)
            score.textContent++
            takenDownArray.push(takenDown)
            boom()
        //if laser hits wall, explodes
        } else if (laserCurrentPosition < width) {
            boom()
        }

    }
    
    //shooting by pressing space
    if (e.code == "Space" ) {
        laserTimer = setInterval(laser,100);
    }

}

//invader moving speed
invaderId = setInterval(invaderMove,500)
document.addEventListener('keydown', playerMove);
document.addEventListener('keyup', shoot);

  })