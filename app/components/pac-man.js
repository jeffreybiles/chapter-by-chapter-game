import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  didInsertElement() {
    this.drawGrid();
    this.drawPac();
  },

  score: 0,
  levelNumber: 1,
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

  drawWall(x, y){
    let ctx = this.get('ctx');
    let squareSize = this.get('squareSize');

    ctx.fillStyle = '#000';
    ctx.fillRect(x * squareSize,
                 y * squareSize,
                 squareSize,
                 squareSize)
  },

  drawGrid(){
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

  drawPac(){
    let x = this.get('x');
    let y = this.get('y');
    let radiusDivisor = 2;
    this.drawCircle(x, y, radiusDivisor)
  },

  drawPellet(x, y){
    let radiusDivisor = 6;
    this.drawCircle(x, y, radiusDivisor)
  },

  drawCircle(x, y, radiusDivisor) {
    let ctx = this.get('ctx')
    let squareSize = this.get('squareSize');

    let pixelX = (x+1/2) * squareSize;
    let pixelY = (y+1/2) * squareSize;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, squareSize/radiusDivisor, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  clearScreen(){
    let ctx = this.get('ctx');
    ctx.clearRect(0, 0, this.get('screenPixelWidth'), this.get('screenPixelHeight'))
  },

  movePacMan: function(direction){
    if(!this.pathBlockedInDirection(direction)){
      this.set('x', this.nextCoordinate('x', direction));
      this.set('y', this.nextCoordinate('y', direction));

      this.processAnyPellets();
    }

    this.clearScreen();
    this.drawGrid();
    this.drawPac();
  },


  nextCoordinate(coordinate, direction){
    return this.get(coordinate) + this.get(`directions.${direction}.${coordinate}`);
  },

  processAnyPellets(){
    let x = this.get('x');
    let y = this.get('y');
    let grid = this.get('grid');

    if(grid[y][x] == 2){
      grid[y][x] = 0;
      this.incrementProperty('score')

      if(this.levelComplete()){
        this.incrementProperty('levelNumber')
        this.restartLevel()
      }
    }
  },

  levelComplete(){
    let hasPelletsLeft = false;
    let grid = this.get('grid');

    grid.forEach((row)=>{
      row.forEach((cell)=>{
        if(cell == 2){
          hasPelletsLeft = true
        }
      })
    })
    return !hasPelletsLeft;
  },

  restartLevel(){
    this.set('x', 0);
    this.set('y', 0);

    let grid = this.get('grid');
    grid.forEach((row, rowIndex)=>{
      row.forEach((cell, columnIndex)=>{
        if(cell == 0){
          grid[rowIndex][columnIndex] = 2
        }
      })
    })
  },

  pathBlockedInDirection(direction) {
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },

  cellTypeInDirection(direction) {
    let nextX = this.nextCoordinate('x', direction);
    let nextY = this.nextCoordinate('y', direction);

    return this.get(`grid.${nextY}.${nextX}`);
  },

  directions: {
    'up': {x: 0, y: -1},
    'down': {x: 0, y: 1},
    'left': {x: -1, y: 0},
    'right': {x: 1, y: 0},
    'stopped': {x: 0, y: 0}
  },

  keyboardShortcuts: {
    up() { this.movePacMan('up');},
    down()  { this.movePacMan('down');},
    left() { this.movePacMan('left');},
    right() { this.movePacMan('right');},
  },
});
