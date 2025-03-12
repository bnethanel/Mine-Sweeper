function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('')
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}


function highlightAvailableSeatsAround(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        console.log(rowIdx, colIdx)
        // console.log(i)
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // console.log(j)
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked) {
                const currSeat = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                
                currSeat.classList.add('highlighted')
                setTimeout(() => {
                    currSeat.classList.remove('highlighted')
                }, 2500)
            }
        }
    }
}

function onHighlight() {
    const i = +gElSelectedSeat.dataset.i
    const j = +gElSelectedSeat.dataset.j
    highlightAvailableSeatsAround(gCinema, i, j)

}