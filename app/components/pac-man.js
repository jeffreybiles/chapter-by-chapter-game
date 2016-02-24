import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  didInsertElement: function() {
    this.drawGrid();
    this.drawCircle();
  },

  x: 1,
  y: 2,
  // 0 is a blank space
  // 1 is a wall
  // 2 is a pellet
  grid: [
    [2, 2, 2, 2, 2, 2, 2, 1],
    [2, 1, 2, 1, 2, 2, 2, 1],
    [2, 2, 1, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
  ],
  squareSize: 40,
  screenWidth: Ember.computed(function(){
    return this.get('grid.firstObject.length')
  }),
  screenHeight: Ember.computed(function(){
    return this.get('grid.length');
  }),
  screenPixelWidth: Ember.computed(function(){
    return this.get('screenWidth') * this.get('squareSize');
  }),
  screenPixelHeight: Ember.computed(function() {
    return this.get('screenHeight') * this.get('squareSize');
  }),
  ctx: Ember.computed(function(){
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    return ctx;
  }),

  drawWall: function(x, y){
    let ctx = this.get('ctx');
    let squareSize = this.get('squareSize');

    ctx.fillStyle = '#000';
    ctx.fillRect(x * squareSize,
                 y * squareSize,
                 squareSize,
                 squareSize)
  },

  drawPellet(x, y){
    let ctx = this.get('ctx')
    let squareSize = this.get('squareSize');

    let pixelX = (x+1/2) * squareSize;
    let pixelY = (y+1/2) * squareSize;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, squareSize/6, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  drawGrid: function(){
    let grid = this.get('grid');
    grid.forEach((row, rowIndex)=>{
      row.forEach((cell, columnIndex)=>{
        if(cell == 1){
          this.drawWall(columnIndex, rowIndex);
        }
        if(cell == 2){
          this.drawPellet(columnIndex, rowIndex);
        }
      })
    })
  },

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
    ctx.clearRect(0, 0, this.get('screenPixelWidth'), this.get('screenPixelHeight'))
  },

  movePacMan(direction, amount){
    this.incrementProperty(direction, amount);

    if(this.collidedWithBorder() || this.collidedWithWall()) {
      this.decrementProperty(direction, amount)
    }

    this.clearScreen();
    this.drawGrid();
    this.drawCircle();
  },

  collidedWithBorder: function(){
    let x = this.get('x');
    let y = this.get('y');
    let screenHeight = this.get('screenHeight');
    let screenWidth = this.get('screenWidth');

    let pacOutOfBounds = x < 0 ||
                         y < 0 ||
                         x >= screenWidth ||
                         y >= screenHeight
    return pacOutOfBounds
  },

  collidedWithWall: function(){
    let x = this.get('x');
    let y = this.get('y');
    let grid = this.get('grid');

    return grid[y][x] == 1
  },

  keyboardShortcuts: {
    up: function() { this.movePacMan('y', -1);},
    down: function()  { this.movePacMan('y', 1);},
    left: function() { this.movePacMan('x', -1);},
    right: function() { this.movePacMan('x', 1);},
  },
});
