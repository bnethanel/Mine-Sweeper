'use strict'

var gBoard
const MINE = '💣'
const FLAG = '🚩'
const NORMAL = '😃'
const LOST = '🤯'
const WON = '😎'

let gGame = {
    isOn: false,
    gameStatus: NORMAL,
    firstClick: true,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
}

const gLevel = {
    SIZE: 5,
    MINES: 4
}


function onInit() {
    gGame = {
        isOn: true,
        gameStatus: NORMAL,
        firstClick: true,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3
    }
    gBoard = createBoard()
    renderBoard()
}

function createBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        // var cell = {}
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isCovered: true,
                isMine: false,
                isMarked: false,
                i: i,
                j: j
            }
            // if ((i === 0 && j === 0) || (i === 0 && j === 1)) {
            //     board[i][j] = {
            //         minesAroundCount: 0,
            //         isCovered: true,
            //         isMine: true,
            //         isMarked: false,
            //         i: i,
            //         j: j
            //     }
            // }
        }
    }
    console.log(board)
    return board
}


function renderBoard() {
    var strHTML = ''
    var lives = document.querySelector('.lives-counter')
    lives.innerHTML = `Lives: ${gGame.lives}`
    var gameButton = document.querySelector('.restart-button')
    gameButton.innerHTML = (`<button class = "game-button" onclick="restartGame()">${gGame.gameStatus}</button>`)


    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="board-row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            // const cell = gBoard[i][j]

            strHTML += `\t<td class="cell cell-${i}-${j}" 
                            onclick="onCellClicked(this, ${i}, ${j})"
                            oncontextmenu="onCellRightClicked(event, this, ${i}, ${j})"> 
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    const elBoard = document.querySelector('.board-cells')
    elBoard.innerHTML = strHTML
}

function countMinesAround(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            if (gBoard[i][j].isMine) {
                count++
            }
        }
    }

    return count
}

function onCellClicked(elCell, i, j) {
    if (gGame.gameStatus === WON) return

    if (!gGame.lives) {
        return
    }
    if (gBoard[i][j].isMarked) {
        return
    }

    if (elCell.classList.contains('marked')) return

    if (gGame.firstClick) {
        setMines(i, j)
        setMinesNegsCount(gBoard)
        gGame.firstClick = false
    }



    gBoard[i][j].isCovered = false
    elCell.classList.add('marked')
    if (gBoard[i][j].minesAroundCount > 0) {
        elCell.innerHTML = `<p>${countMinesAround(gBoard, i, j)}<p/>`
    }
    if (gBoard[i][j].minesAroundCount === 0) {
        expandReveal(gBoard, elCell, i, j)
    }

    // if(!gBoard[i][j].isMine) {
    //     gGame.revealedCount++
    //     console.log('reveled count', gGame.revealedCount)
    // }

    if (gBoard[i][j].isMine) {
        elCell.innerHTML = `<p>${MINE}<p/>`
        gGame.lives--
        var lives = document.querySelector('.lives-counter')
        lives.innerHTML = `Lives: ${gGame.lives}`
        if (gGame.lives === 0) {
            gGame.gameStatus = LOST
            document.querySelector('.game-button').innerHTML = (`${gGame.gameStatus}`)
            return
        }
        setTimeout(() => {
            elCell.classList.remove('marked');
            elCell.innerHTML = ""
        }, 1500);
    }
    checkGameOver()
}



function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            board[i][j].minesAroundCount = countMinesAround(gBoard, i, j)
        }
    }
}

function expandReveal(board, elCell, i, j) {
    checkMinesAround(gBoard, i, j)
    // if (board[i][j].minesAroundCount === 0) {
    //     var currCell = document.querySelector(`.cell-${i}-${j}`)
    //     currCell.classList.add('marked')
    // }
    if (board[i][j].minesAroundCount > 0) {
        var currCell = document.querySelector(`.cell-${i}-${j}`)
        currCell.classList.add('marked')
    }


}



function setMines(firstI, firstJ) {
    var minesPlaced = 0

    while (minesPlaced < gLevel.MINES) {
        var positionI = getRandomInt(0, gBoard.length)
        var positionJ = getRandomInt(0, gBoard.length)

        if (positionI === firstI && positionJ === firstJ) continue

        if (gBoard[positionI][positionJ].isMine) continue

        gBoard[positionI][positionJ].isMine = true
        minesPlaced++;
    }
}

function checkMinesAround(board, rowIdx, colIdx) {


    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].minesAroundCount === 0) {
                var currCell = document.querySelector(`.cell-${i}-${j}`)
                currCell.classList.add('marked')
            }
            if (gBoard[i][j].minesAroundCount > 0) {
                var currCell = document.querySelector(`.cell-${i}-${j}`)
                currCell.classList.add('marked')
                currCell.innerHTML = (`<p>${gBoard[i][j].minesAroundCount}<p/>`)
            }
        }
    }
}

function onCellRightClicked(event, elCell, i, j) {
    event.preventDefault()
    if (elCell.classList.contains('marked')) return
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        elCell.innerHTML = "🚩"
    } else {
        gBoard[i][j].isMarked = false;
        elCell.innerHTML = ""
    }

}

function restartGame() {
    onInit()
}

function checkGameOver() {
    var normalCell = 0
    var revealedCells = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = document.querySelector(`.cell-${i}-${j}`)
            if (!gBoard[i][j].isMine) {
                normalCell++
                if (currCell.classList.contains('marked')) {
                    revealedCells++
                    gGame.revealedCount = revealedCells
                }
            }
        }
    }
    if (normalCell === revealedCells) {
        gGame.isOn = false
        gGame.gameStatus = WON
        document.querySelector('.game-button').innerHTML = (`${gGame.gameStatus}`)
        return
    }
}