import {getNextMoveByBot} from './bot.js'
let containerDiv = null
let board
let openTiles
let boardUIElements
let gameResultScreen
let playerSymbol
let botSymbol
let turn
// let board = {}
// let openTiles = {
//   "00": true,
//   "01": true,
//   "02": true,
//   "10": true,
//   "11": true,
//   "12": true,
//   "20": true,
//   "21": true,
//   "22": true
// }
// let boardUIElements = {}
// let gameResultScreen = null
// let playerSymbol = ''
// let botSymbol = ''
// let turn = ''

function getGameStatus(board) {
  const result = {
    isOver: false,
    winner: ''
  }
  //Horizontal
  for (let i = 0; i < 3; i++) {
    if (board[`${i}0`] && 
        board[`${i}1`] && 
        board[`${i}2`] && 
        board[`${i}0`] === board[`${i}1`] && 
        board[`${i}1`] === board[`${i}2`]) {
      result.isOver = true
      result.winner = board[`${i}0`]
      return result
    }
  }

  //Vertical
  for (let i = 0; i < 3; i++) {
    if (board[`0${i}`] &&
        board[`1${i}`] && 
        board[`2${i}`] && 
        board[`0${i}`] === board[`1${i}`] && 
        board[`1${i}`] === board[`2${i}`]) {
      result.isOver = true
      result.winner = board[`0${i}`]
      return result
    }
  }

  //Diagonal1
  if (board['00'] && 
      board['11'] && 
      board['22'] && 
      board['00'] === board['11'] && 
      board['11'] === board['22']) {
    result.isOver = true
    result.winner = board['00']
    return result
  }

  //Diagonal2
  if (board['02'] && 
      board['11'] && 
      board['20'] && 
      board['02'] === board['11'] && 
      board['11'] === board['20']) {
    result.isOver = true
    result.winner = board['02']
    return result
  }

  if (Object.keys(board).length === 9) {
    result.isOver = true
  }

  return result

}
export function renderBoard(parentElement) {

  initializeGameVariables()
  containerDiv = parentElement
  removeAllChild(parentElement)

  const boardUI = document.createElement('div')
  boardUI.addEventListener('click', handlePlayersTileSelection)
  boardUI.setAttribute('class', 'board')
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let cell = document.createElement('div')
      cell.setAttribute('class', 'cell')
      cell.setAttribute('data-row', i)
      cell.setAttribute('data-column', j)
      boardUIElements[`${i}${j}`] = cell
      boardUI.appendChild(cell)
    }
  }
  boardUI.appendChild(createGameResultScreen())
  
  const gameContainer = document.createElement('div')
  gameContainer.setAttribute('class', 'game-container')
  gameContainer.appendChild(createPlayerSelector(handleSymbolSelection))
  gameContainer.appendChild(boardUI)
  parentElement.appendChild(gameContainer)
}
function removeAllChild(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
function createGameResultScreen() {
  gameResultScreen = document.createElement('div')
  gameResultScreen.setAttribute('class', 'game-result')
  return gameResultScreen
}
function initializeGameVariables() {
  board = {}
  openTiles = {
    "00": true,
    "01": true,
    "02": true,
    "10": true,
    "11": true,
    "12": true,
    "20": true,
    "21": true,
    "22": true
  }
  boardUIElements = {}
  gameResultScreen = null
  playerSymbol = ''
  botSymbol = ''
  turn = ''
}
function restartGame() {
  renderBoard(containerDiv)
}
function displayGameResult(winner) {
  const winningText = winner ? `${winner} won` : 'Its a draw'
  const text = createTextElement(winningText, 'winning-text')
  gameResultScreen.appendChild(text)
  
  const restartButton = document.createElement('div')
  restartButton.setAttribute('class', 'restart-button')
  restartButton.addEventListener('click', restartGame)
  const restartButtonText = createTextElement('Restart', 'restart-text')
  restartButton.appendChild(restartButtonText)
  gameResultScreen.appendChild(restartButton)

  gameResultScreen.classList.add('open')
}
function createPlayerSelector(onSelection) {
  const container = document.createElement('div')
  container.setAttribute('class', 'player-selector')
  const label = createTextElement('Select Player', 'player-selection-label')
  container.appendChild(label)

  const playerX = createPlayerButton('X', onSelection)
  container.appendChild(playerX)

  const playerO = createPlayerButton('O', onSelection)
  container.appendChild(playerO)

  return container
}

function createPlayerButton(symbol, onClick) {
  const button = document.createElement('div')
  button.setAttribute('data-symbol', symbol)
  button.setAttribute('class', 'player-button')
  button.addEventListener('click', onClick)
  const label = createTextElement(symbol,'player-button-label')
  button.appendChild(label)
  return button
}
function handleSymbolSelection(event) {
  if (playerSymbol) {
    return
  }
  const target = event.target
  playerSymbol = target.dataset.symbol
  botSymbol = playerSymbol === 'X' ? 'O' : 'X'
  target.classList.add('selected')
  turn = 'X'
  if (botSymbol === 'X') {
    markAndEvaluateBotSelection()
  }
}
function markAndEvaluateBotSelection() {
  if (turn === botSymbol) {
    setTimeout(() => {
      const selection = getNextMoveByBot(board, openTiles, botSymbol, playerSymbol)
      updateBoard(selection, botSymbol)
      const gameStatus = getGameStatus(board)
      if (gameStatus.isOver) {
        displayWinner(gameStatus.winner)
      }
    }, 1000)
  }
}
function displayWinner(winner) {
  setTimeout(()=>{
    displayGameResult(winner)
  }, 0)
}
function updateBoard(selection, symbol) {
  const {row, column} = selection
  const key = `${row}${column}`
  board[key] = symbol
  delete openTiles[key]
  boardUIElements[key].appendChild(createTextElement(symbol, 'mark'))
  toggleTurn()
}
function toggleTurn() {
  turn = turn === 'X' ? 'O' : 'X'
}

function handlePlayersTileSelection(event) {
  if (turn === playerSymbol) {
    const target = event.target
    const row = target.dataset.row
    const column = target.dataset.column
    updateBoard({row, column}, playerSymbol)
    const gameStatus = getGameStatus(board)
    if (gameStatus.isOver) {
      displayWinner(gameStatus.winner)
    } else {
      markAndEvaluateBotSelection()
    }
  }
}
function createTextElement(text, className) {
  const textNode = document.createTextNode(text)
  const element = document.createElement('span')
  element.setAttribute('class', className)
  element.appendChild(textNode)
  return element
}