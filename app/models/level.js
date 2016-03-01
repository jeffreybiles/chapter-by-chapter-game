import Ember from 'ember';

export default Ember.Object.extend({
  squareSize: 40,
  width: Ember.computed(function(){
    return this.get('grid.firstObject.length')
  }),
  height: Ember.computed(function(){
    return this.get('grid.length');
  }),
  pixelWidth: Ember.computed(function(){
    return this.get('width') * this.get('squareSize');
  }),
  pixelHeight: Ember.computed(function() {
    return this.get('height') * this.get('squareSize');
  }),

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

  isComplete(){
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
})
