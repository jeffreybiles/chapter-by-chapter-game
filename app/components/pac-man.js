import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    this.drawCircle();
  },

  drawCircle: function() {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let x = 50;
    let y = 100;
    let radius = 20;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },
});
