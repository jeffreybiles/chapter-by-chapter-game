import Ember from 'ember';
import SharedStuff from '../mixins/shared-stuff';
import Movement from '../mixins/movement';

export default Ember.Object.extend(SharedStuff, Movement, {
  direction: 'stopped',
  restart(){
    this.set('x', 0);
    this.set('y', 0);
    this.set('frameCycle', 0);
    this.set('direction', 'stopped')
  },

  draw(){
    let x = this.get('x');
    let y = this.get('y');
    let radiusDivisor = 2;
    this.drawCircle(x, y, radiusDivisor, this.get('direction'));
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
      let chances = ((this.get('pac.y') - this.get('y')) * this.get(`directions.${direction}.y`)) +
                    ((this.get('pac.x') - this.get('x')) * this.get(`directions.${direction}.x`))
      return Math.max(chances, 0) + 0.2
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