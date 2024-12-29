// gameState.js
export class GameState {
  constructor() {
    this.gameState = '1';
    this.paddles = {
      left: { top: "50%" },
      right: { top: "50%" }
    };
    this.ballPosition = { x: "50%", y: "50%" };
    this.scores = { left: 0, right: 0 };
    this.minutes = 0;
    this.seconds = 0;
    this.message = 'none';
    this.animationId = null;
  }

  reset() {
    this.gameState = '1';
    this.scores = { left: 0, right: 0 };
    this.paddles = {
      left: { top: "50%" },
      right: { top: "50%" }
    };
    this.ballPosition = { x: "50%", y: "50%" };
    this.minutes = 0;
    this.seconds = 0;
    this.message = 'none';
    this.animationId = null;
  }

  updateFromMessage(data) {
    switch (data.type) {
      case "paddle_update":
        this.paddles = data.paddles;
        break;
      case "ball_update":
        this.ballPosition = data.ball;
        break;
      case "update":
        this.scores = data.scores;
        this.minutes = data.time.min;
        this.seconds = data.time.sec;
        break;
      case "message":
        this.message = data.message;
        break;
    }
  }
}