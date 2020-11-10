import {getRandomIntegerBetween} from './util.js'

function getRandomMoveByBot(board, openTiles) {
  let column = 0
  let row = 0

  const openEntries = Object.keys(openTiles)
  const randomNumber = getRandomIntegerBetween(0, openEntries.length)
  const rowAndColum = openEntries[randomNumber].split('')
  return {
    row : parseInt(rowAndColum[0]), 
    column : parseInt(rowAndColum[1]) 
  }
}
export function getNextMoveByBot(board, openTiles, botSymbol, playerSymbol) {
  //Can I win
  let nextMove

  nextMove = getWinningMove(board, botSymbol)
  if (nextMove) {
    return nextMove
  }

  //Is opponent winning
  
  nextMove = getBlockingMove(board, playerSymbol)
  if (nextMove) {
    return nextMove
  }

  return getRandomMoveByBot(board, openTiles)
  // Check whether opponent is about to win

}

function getWinningMove(board, symbol) {
  let nextMove
  
  for (let i = 0; i < 3; i++) {
    nextMove = isWinning(board, symbol, i)
    if (nextMove) {
      return nextMove
    }
  }

  for (let i = 0; i < 3; i++) {
    nextMove = isWinning(board, symbol, null, i)
    if (nextMove) {
      return nextMove
    }
  }

  nextMove = isWinning(board, symbol, null, null, true)
  if (nextMove) {
    return nextMove
  }

  nextMove = isWinning(board, symbol, null, null, null, true)
  if (nextMove) {
    return nextMove
  }
}

function getBlockingMove(board, symbol) {
  let nextMove
  for (let i = 0; i < 3; i++) {
    nextMove = isWinning(board, symbol, i)
    if (nextMove) {
      return nextMove
    }
  }

  for (let i = 0; i < 3; i++) {
    nextMove = isWinning(board, symbol, null, i)
    if (nextMove) {
      return nextMove
    }
  }

  nextMove = isWinning(board, symbol, null, null, true)
  if (nextMove) {
    return nextMove
  }

  nextMove = isWinning(board, symbol, null, null, null, true)
  if (nextMove) {
    return nextMove
  }
}

function isWinning(board, symbol, row, col, diagonal1, diagonal2) {
  let selectionToWin = {}
  let winning = false
  
  if (row || row === 0) {
    if (  (board[`${row}0`] === symbol && board[`${row}1`] === symbol && !board[`${row}2`]) ||
          (board[`${row}1`] === symbol && board[`${row}2`] === symbol && !board[`${row}0`]) ||
          (board[`${row}0`] === symbol && board[`${row}2`] === symbol && !board[`${row}1`]) 
        ){
          selectionToWin.row = row
          winning = true
          if (!board[`${row}0`]) {
            selectionToWin.column = 0
          } else if (!board[`${row}1`]) {
            selectionToWin.column = 1
          } else {
            selectionToWin.column = 2
          }
    }
  } else if (col || col === 0) {
    if (  (board[`0${col}`] === symbol && board[`1${col}`] === symbol && !board[`2${col}`]) ||
          (board[`1${col}`] === symbol && board[`2${col}`] === symbol && !board[`0${col}`]) ||
          (board[`0${col}`] === symbol && board[`2${col}`] === symbol && !board[`1${col}`]) 
        ){
          selectionToWin.column = col
          winning = true
          if (!board[`0${col}`]) {
            selectionToWin.row = 0
          } else if (!board[`1${col}`]) {
            selectionToWin.row = 1
          } else {
            selectionToWin.row = 2
          }
    }
  } else if (diagonal1) {
    if (  (board[`00`] === symbol && board[`11`] === symbol && !board[`22`]) ||
          (board[`11`] === symbol && board[`22`] === symbol && !board[`00`]) ||
          (board[`00`] === symbol && board[`22`] === symbol && !board[`11`]) 
        ){
          winning = true
          if (!board[`00`]) {
            selectionToWin.row = 0
            selectionToWin.column = 0
          } else if (!board[`11`]) {
            selectionToWin.row = 1
            selectionToWin.column = 1
          } else {
            selectionToWin.row = 2
            selectionToWin.column = 2
          }
    }
  } else if (diagonal2) {
    if (  (board[`02`] === symbol && board[`11`] === symbol && !board[`20`]) ||
          (board[`11`] === symbol && board[`20`] === symbol && !board[`02`]) ||
          (board[`02`] === symbol && board[`20`] === symbol && !board[`11`]) 
    ){
      winning = true
      if (!board[`02`]) {
        selectionToWin.row = 0
        selectionToWin.column = 2
      } else if (!board[`11`]) {
        selectionToWin.row = 1
        selectionToWin.column = 1
      } else {
        selectionToWin.row = 2
        selectionToWin.column = 0
      }
    }
  }
  if (winning) {
    return selectionToWin
  }
}