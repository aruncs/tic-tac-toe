import {renderBoard} from './game.js'

window.onload = function() {
  const container = document.getElementById('container')
  renderBoard(container)
}