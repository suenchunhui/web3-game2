import * as THREE from '../public/vendor/three';
import PointerLockControls from '../public/vendor/PointerLockControls.js';
import OrbitControls from '../public/vendor/OrbitControls.js';

import Key from './key';
import Audio from './audio';
import GameNotes from './game_notes';
import GameView from './game_view';
import Instructions from './instructions';

class Game {
  constructor() {
    this.noteInterval = 237.8;
    this.musicDelay = 1980;
    this.key = new Key();
    this.instructions = new Instructions();
    this.started = false;

    this.gameStartEl = document.getElementsByClassName('start')[0];
    this.gameStartListener =
      window.addEventListener("keypress", this.hitAToStart.bind(this));

    this.createGameView();
  }

  startGame() {
    this.addMusic();
    this.gameView.addMovingNotes(this.noteInterval);
    this.gameStartEl.className = "start hidden";
    this.started = true;
  }

  hitAToStart(e) {
    if (!this.started) {
      if (e.keyCode === 97 || e.keyCode === 65) {
        this.startGame();
      }
    }
  }

  createGameView() {
    // SCENE SIZE
    let width = window.innerWidth,
      height = window.innerHeight;

    // CAMERA ATTRIBUTE
    let viewAngle = 75,
      aspect = width / height,
      near = 0.1,
      far = 10000;

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
      viewAngle,
      aspect,
      near,
      far);

    camera.position.z = 150;

    
    let canvasElm = document.getElementById('canvas2');
    let renderer = new THREE.WebGLRenderer({ canvas: canvasElm });
    renderer.setSize( width, height );
    //renderer.canvas = document.getElementById('canvas2');
    //document.getElementById('game-canvas').appendChild( renderer.domElement );

    this.gameView = new GameView(
      renderer, camera, scene, this.key, this.musicDelay
    );
    this.gameView.setup();
  }

  addMusic() {
    this.music = new Audio(this.musicDelay);
    this.music.startMusic();
    setTimeout(this.music.fadeOut.bind(this.music), 213000);
  }

}

export default Game;
