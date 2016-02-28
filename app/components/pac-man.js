import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
import SharedStuff from '../mixins/shared-stuff';
import Pac from '../models/pac';

export default Ember.Component.extend(KeyboardShortcuts, SharedStuff, {
  didInsertElement() {
    this.set('pac', Pac.create())
    this.movementLoop();
  },

  score: 0,
  levelNumber: 1,

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

  drawPellet(x, y){
    let radiusDivisor = 6;
    this.drawCircle(x, y, radiusDivisor, 'stopped');
  },

  clearScreen(){
    let ctx = this.get('ctx');
    ctx.clearRect(0, 0, this.get('screenPixelWidth'), this.get('screenPixelHeight'))
  },

  movementLoop(){
    if(this.get('pac.frameCycle') == this.get('pac.framesPerMovement')){
      let direction = this.get('pac.direction')
      this.set('pac.x', this.get('pac').nextCoordinate('x', direction));
      this.set('pac.y', this.get('pac').nextCoordinate('y', direction));

      this.set('pac.frameCycle', 1);

      this.processAnyPellets();

      this.get('pac').changeDirection();
    } else if(this.get('pac.direction') == 'stopped'){
      this.get('pac').changeDirection();
    } else {
      this.incrementProperty('pac.frameCycle');
    }

    this.clearScreen();
    this.drawGrid();
    this.get('pac').draw();

    Ember.run.later(this, this.movementLoop, 1000/60);
  },

  processAnyPellets(){
    let x = this.get('pac.x');
    let y = this.get('pac.y');
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
    this.set('pac.x', 0);
    this.set('pac.y', 0);

    let grid = this.get('grid');
    grid.forEach((row, rowIndex)=>{
      row.forEach((cell, columnIndex)=>{
        if(cell == 0){
          grid[rowIndex][columnIndex] = 2
        }
      })
    })
  },

  keyboardShortcuts: {
    up() { this.set('pac.intent', 'up');},
    down()  { this.set('pac.intent', 'down');},
    left() { this.set('pac.intent', 'left');},
    right() { this.set('pac.intent', 'right');},
  },
});
