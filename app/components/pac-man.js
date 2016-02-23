import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  didInsertElement: function() {
    this.drawCircle();
  },

  x: 50,
  y: 100,
  squareSize: 40,
  drawCircle: function() {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let x = this.get('x');
    let y = this.get('y');
    let radius = this.get('squareSize')/2;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  keyboardShortcuts: {
    up: function() { this.incrementProperty('y', -1 * this.get('squareSize')); this.drawCircle()},
    down: function()  { this.incrementProperty('y', this.get('squareSize')); this.drawCircle()},
    left: function() { this.incrementProperty('x', -1 * this.get('squareSize')); this.drawCircle()},
    right: function() { this.incrementProperty('x', this.get('squareSize')); this.drawCircle()},
  },
});
