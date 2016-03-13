import Ember from 'ember';
import SharedStuff from '../mixins/shared-stuff';
import Movement from '../mixins/movement';

export default Ember.Object.extend(SharedStuff, Movement, {
  direction: 'stopped',
  intent: 'stopped',
  timers: ['powerModeTime'],
  maxPowerModeTime: 400,
  powerModeTime: 0,
  powerMode: Ember.computed.gt('powerModeTime', 0),

  restart(){
    this.set('x', this.get('level.startingPac.x'));
    this.set('y', this.get('level.startingPac.y'));
    this.set('frameCycle', 0);
    this.set('direction', 'stopped')
  },

  draw(){
    let x = this.get('x');
    let y = this.get('y');
    let radiusDivisor = 2;
    let color = this.get('powerMode') ? '#AF0' : '#FE0';
    this.drawCircle(x, y, radiusDivisor, this.get('direction'), color);
  },

  changeDirection(){
    let intent = this.get("intent")
    if(this.pathBlockedInDirection(intent)){
      this.set('direction', 'stopped');
    } else {
      this.set('direction', intent);
    }
  },
})
