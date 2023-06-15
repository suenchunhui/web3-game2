import Authentication from "../components/Authentication";
import Head from "next/head";

import React, { useRef, useEffect } from 'react'
export default function game(props){
    const { isAuth, role } = props;

    const canvasRef = useRef(null)

    // useEffect(() => {
    //     // state
    //     //get canvas
    //     const canvas = canvasRef.current
    //     const context = canvas.getContext('2d')
    //     //        <canvas ref={canvasRef}/>
    //   }, [])

    return(
    <div>
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Bangers" rel="stylesheet" />
        <script src="vendor/three.js"></script>
        <script type="text/javascript" src="lib/bundle.js"></script>
        <div id="game-canvas">
            <div className="game-display">
                <div className="header">
                    <p className="creator"></p>
                    <h1 className="title">Gacha Beats</h1>
                </div>

            <div className="game-details">
            <div className="game-details-left">
                <h1 className="score">Score: 0</h1>
                <h1 className="max-streak">Max Streak: 0</h1>
            </div>
            <div className="game-details-right">
                <h1 className="multiplier">Multiplier: 1X</h1>
                <h1 className="streak">Streak: 0</h1>
            </div>
            </div>

            <div className="game-start">
            <h1 className="start">PRESS "A" TO START</h1>
            </div>

            <div className="instructions">
            <div className="close-instructions">
                <h1>X</h1>
                <h2>(close instructions)</h2>
            </div>
            <ul className="instructions-text">
                <h1>Instructions</h1>
                <li>As the colored notes move to the circles at the bottom of the fret board, hit the corresponding keys in sequence to score points!</li>
                <li>Score enough notes in a row, and your score multiplier will increase!</li>
                <li>To take a look around, click the button in the lower left hand corner.</li>
            </ul>
            <ul className="letters">
                <li className="green">A</li>
                <li className="red">S</li>
                <li className="yellow">D</li>
                <li className="blue">F</li>
                <li className="orange">G</li>
            </ul>
            </div>

            <div className="game-progress">
            <input
                className="rock-input"
                type="range"
                min="-20"
                max="20"
                >
            </input>
            <h1 className="rock-header">Rock Meter</h1>
            </div>

            </div>
            <div className="game-control-panel">
                <button className="open-instructions">How To Play</button>
                <button className="look-around">Look Around</button>
                <button className="play-pause hidden">Pause</button>
                <button className="mute">Mute</button>
            </div>
            <canvas id="canvas2" ref={canvasRef}/>
        </div>
        <div id="song"></div>

        <div className="look-around-instructions hidden">
        <h1>CLICK AND DRAG TO LOOK AROUND</h1>
        </div>
    </div>
    )
}
