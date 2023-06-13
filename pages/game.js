import React, { useRef, useEffect } from 'react'
const Game = require('../lib/game');
const GameView = require('../lib/game_view');
const Constants = require('../lib/constants');
import { useState } from "react";

const GamePage = props => {
  
  const canvasRef = useRef(null)
  let game = new Game()
  let gameView;

  const [songBtnClickHandler, setSongBtnClickHandler] = useState(undefined);
  const [welcomeHidden, setWelcomeHidden] = useState(undefined);
  
  useEffect(() => {
    // state
    //get canvas
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    //audio
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioContext = new AudioContext()

    //setup game    
    game.setAudioContext(audioContext)
    gameView = new GameView(game, context, setSongBtnClickHandler, setWelcomeHidden)
    gameView.loadGame()
  }, [])

  return <div>
    <div id="mute-button"></div>
    <button onClick={songBtnClickHandler}>Ode to Joy</button>
    <canvas ref={canvasRef} {...props} height={Constants.HEIGHT} width={Constants.WIDTH}/>
  </div>
}

export default GamePage
