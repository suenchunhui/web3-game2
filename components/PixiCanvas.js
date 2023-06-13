"use client";
import React, { useEffect, useRef } from 'react';

let PIXI;

const PixiCanvas = () => {
    const canvasRef = useRef();

    useEffect(() => {
        import('pixi.js').then((pixi) => {
            PIXI = pixi;

            const app = new PIXI.Application({ width: 800, height: 600 });
            canvasRef.current.appendChild(app.view);

            // Button Graphics
            let buttons = [];
            let colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00];
            let keys = ['Q', 'W', 'E', 'R'];
            let keyCodes = [81, 87, 69, 82];
            let score = 0;

            for(let i = 0; i < 4; i++){
                let button = new PIXI.Graphics();
                button.beginFill(colors[i]);
                button.drawCircle(0, 0, 50);
                button.endFill();
                button.x = 100 + i*150;
                button.y = 300;
                button.interactive = true;
                button.buttonMode = true;
                button.name = keys[i];
                buttons.push(button);
                app.stage.addChild(button);
            }

            let currentButton = null;

            function getRandomButton(){
                return buttons[Math.floor(Math.random()*4)];
            }

            function flashButton(button){
                let originalColor = button._fillStyle.color;
                button.tint = 0xAAAAAA;
                setTimeout(() => {
                    button.tint = originalColor;
                }, 500);
                currentButton = button;
            }

            setInterval(() => {
                flashButton(getRandomButton());
            }, 1000);

            window.addEventListener('keydown', function(event) {
                let keyCode = event.keyCode;
                if(currentButton && keyCodes.includes(keyCode)){
                    if(currentButton.name === keys[keyCodes.indexOf(keyCode)]){
                        score += 1;
                        console.log("Score: " + score);
                        if(score === 10) {
                            console.log("You win!");
                        }
                        currentButton = null;
                    } else {
                        console.log("Wrong button!");
                    }
                }
            });

        });
    }, []);

    return <div ref={canvasRef} />;
};

export default PixiCanvas;