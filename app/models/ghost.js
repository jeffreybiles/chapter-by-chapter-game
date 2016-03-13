import Ember from 'ember';
import SharedStuff from '../mixins/shared-stuff';
import Movement from '../mixins/movement';

export default Ember.Object.extend(SharedStuff, Movement, {
  init() {
    this.set('startingX', this.get('x'));
    this.set('startingY', this.get('y'));
    return this._super(...arguments);
  },
  direction: 'stopped',
  removed: false,

  restart(){
    this.set('x', this.get('startingX'));
    this.set('y', this.get('startingY'));
    this.set('frameCycle', 0);
    this.set('direction', 'stopped');
  },

  retreat(){
    this.set('removed', true)
    this.set('x', -1)
    this.set('y', -1)
  },

  draw(){
    let x = this.get('x');
    let y = this.get('y');
    let radiusDivisor = 2;
    this.drawCircle(x, y, radiusDivisor, this.get('direction'), '#F55');
  },

  changeDirection(){
    let directions = ['left', 'right', 'up', 'down']
    let directionWeights = directions.map((direction)=>{
      return this.chanceOfPacmanIfInDirection(direction);
    })

    let bestDirection = this.getRandomItem(directions, directionWeights);
    this.set('direction', bestDirection)
  },

  chanceOfPacmanIfInDirection(direction) {
    if(this.pathBlockedInDirection(direction)){
      return 0;
    } else {
      let desirabilityOfDirection = ((this.get('pac.y') - this.get('y')) * this.get(`directions.${direction}.y`)) +
                    ((this.get('pac.x') - this.get('x')) * this.get(`directions.${direction}.x`))
      if(this.get('pac.powerMode')){
        desirabilityOfDirection *= -1;
      }
      return Math.max(desirabilityOfDirection, 0) + 0.2
    }
  },

  getRandomItem(list, weight) {
    var total_weight = weight.reduce(function (prev, cur, i, arr) {
        return prev + cur;
    });

    var random_num = Math.random() * total_weight;
    var weight_sum = 0;

    for (var i = 0; i < list.length; i++) {
        weight_sum += weight[i];
        weight_sum = Number(weight_sum.toFixed(2));

        if (random_num < weight_sum) {
            return list[i];
        }
    }
  },

})
