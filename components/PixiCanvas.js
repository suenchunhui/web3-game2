"use client"
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const PixiCanvas = () => {
    const canvasRef = useRef();

    useEffect(() => {
        let app = new PIXI.Application({
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1,
        });

        canvasRef.current.appendChild(app.view);

        const pianoKeys = [];
        const numberOfKeys = 14; // 14 keys for two octaves (7 white and 7 black keys)
        const keyWidth = app.view.width / numberOfKeys/2;

        for (let i = 0; i < numberOfKeys; i++) {
            let key = new PIXI.Graphics();
            if (i % 2 === 0) { // White key
                key.beginFill(0xFFFFFF);
            } else { // Black key
                key.beginFill(0x000000);
            }
            key.drawRect(i * keyWidth, 0, keyWidth, app.view.height);
            key.endFill();

            pianoKeys.push(key);
            app.stage.addChild(key);
        }

        // Cleanup on unmount
        return () => {
            app.stop();
            app.view.parentNode.removeChild(app.view);
            app = null;
        };
    }, []);

    return <div ref={canvasRef}></div>;
};

export default PixiCanvas;