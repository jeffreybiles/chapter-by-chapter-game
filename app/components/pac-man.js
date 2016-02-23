import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  didInsertElement: function() {
    this.drawCircle();
  },

  x: 1,
  y: 2,
  squareSize: 40,
  screenWidth: 20,
  screenHeight: 15,
  ctx: Ember.computed(function(){
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    return ctx;
  }),
  drawCircle: function() {
    let ctx = this.get('ctx');
    let x = this.get('x');
    let y = this.get('y');
    let squareSize = this.get('squareSize');

    let pixelX = (x+1/2) * squareSize;
    let pixelY = (y+1/2) * squareSize;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, squareSize/2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  clearScreen: function(){
    let ctx = this.get('ctx');
    let screenPixelWidth = this.get('screenWidth') * this.get('squareSize');
    let screenPixelHeight = this.get('screenHeight') * this.get('squareSize');

    ctx.clearRect(0, 0, screenPixelWidth, screenPixelHeight)
  },

  movePacMan: function(direction, amount){
    this.incrementProperty(direction, amount);
    this.clearScreen();
    this.drawCircle();
  },

  keyboardShortcuts: {
    up: function() { this.movePacMan('y', -1);},
    down: function()  { this.movePacMan('y', 1);},
    left: function() { this.movePacMan('x', -1);},
    right: function() { this.movePacMan('x', 1);},
  },
});
