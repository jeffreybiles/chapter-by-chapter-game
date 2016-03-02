import Ember from 'ember';

export default Ember.Mixin.create({
  x: null,
  y: null,
  level: null,

  loop(){
    if(this.animationCompleted()){
      this.finalizeMove();
      this.changeDirection();
    } else if(this.get('direction') == 'stopped'){
      this.changeDirection();
    } else {
      this.incrementProperty('frameCycle');
    }

    Ember.run.later(this, this.loop, 1000/142);
  },
  animationCompleted(){
    return this.get('frameCycle') == this.get('framesPerMovement');
  },
  finalizeMove(){
    let direction = this.get('direction');
    this.set('x', this.nextCoordinate('x', direction));
    this.set('y', this.nextCoordinate('y', direction));

    this.set('frameCycle', 1);
  },

  pathBlockedInDirection(direction) {
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },

  cellTypeInDirection(direction) {
    let nextX = this.nextCoordinate('x', direction);
    let nextY = this.nextCoordinate('y', direction);

    return this.get(`level.grid.${nextY}.${nextX}`);
  },

  nextCoordinate(coordinate, direction){
    return this.get(coordinate) + this.get(`directions.${direction}.${coordinate}`);
  },
})
