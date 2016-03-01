import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
import SharedStuff from '../mixins/shared-stuff';
import Pac from '../models/pac';
import Level from '../models/level';
import Level2 from '../models/level2'

export default Ember.Component.extend(KeyboardShortcuts, SharedStuff, {
  didInsertElement() {
    let level = Level2.create()
    this.set('level', level)
    let pac = Pac.create({
      level: level,
      x: level.get('startingPac.x'),
      y: level.get('startingPac.y')
    })
    this.set('pac', pac)
    this.loop();
    pac.loop();
  },

  score: 0,
  levelNumber: 1,

  drawWall(x, y){
    let ctx = this.get('ctx');
    let squareSize = this.get('level.squareSize');

    ctx.fillStyle = '#000';
    ctx.fillRect(x * squareSize,
                 y * squareSize,
                 squareSize,
                 squareSize)
  },

  drawGrid(){
    let grid = this.get('level.grid');
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
    ctx.clearRect(0, 0, this.get('level.pixelWidth'), this.get('level.pixelHeight'))
  },

  loop(){
    this.processAnyPellets();

    this.clearScreen();
    this.drawGrid();
    this.get('pac').draw();

    Ember.run.later(this, this.loop, 1000/60);
  },

  processAnyPellets(){
    let x = this.get('pac.x');
    let y = this.get('pac.y');
    let grid = this.get('level.grid');

    if(grid[y][x] == 2){
      grid[y][x] = 0;
      this.incrementProperty('score')

      if(this.get('level').isComplete()){
        this.incrementProperty('levelNumber')
        this.restart()
      }
    }
  },

  restart(){
    this.get('pac').restart();
    this.get('level').restart();
  },

  keyboardShortcuts: {
    up() { this.set('pac.intent', 'up');},
    down()  { this.set('pac.intent', 'down');},
    left() { this.set('pac.intent', 'left');},
    right() { this.set('pac.intent', 'right');},
  },
});
