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
    // fill this in later
  },
})
