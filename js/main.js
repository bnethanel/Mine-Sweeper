'use strict'

var gBoard

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const gLevel = {
    SIZE: 4,
    MINES: 2
   }


function onInit() {
    gBoard = createBoard()
    renderBoard()
    setMinesNegsCount(gBoard)
}

function createBoard() {
    const board = []

    for (var i = 0; i < 4; i++) {
        // var cell = {}
        board[i] = []
        for (var j = 0; j < 4; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isCovered: true,
                isMine: false,
                isMarked: false
            }
            if ((i === 0 && j === 0) || (i === 0 && j === 1)) {
                board[i][j] = {
                    minesAroundCount: 0,
                    isCovered: true,
                    isMine: true,
                    isMarked: false
                }
            }
        }
    }
    console.log(board)
    return board
}


function renderBoard() {
    var strHTML = ''

    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="board-row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            // const cell = gBoard[i][j]

            strHTML += `\t<td class="cell" 
                            onclick="onCellClicked(this, ${i}, ${j})" >
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
    gBoard[i][j].isCovered = false
    elCell.classList.add('marked')
    countMinesAround(gBoard, i, j)
    elCell.innerHTML = `<p>${countMinesAround(gBoard, i, j)}<p/>`
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            board[i][j].minesAroundCount = countMinesAround(board, i, j)
        }
    }
}