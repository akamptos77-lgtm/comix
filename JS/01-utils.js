'use strict';
/* ============================================
   01-UTILS: DOM-хелперы, математика, звук,
   полифил roundRect
   ============================================ */

/* --- DOM --- */
var $  = function(s){ return document.querySelector(s); };
var $$ = function(s){ return document.querySelectorAll(s); };

/* --- Математика --- */
var rand  = function(a, b){ return a + Math.random() * (b - a); };
var ri    = function(a, b){ return Math.floor(rand(a, b + 1)); };
var pick  = function(a){ return a[Math.floor(Math.random() * a.length)]; };
var clamp = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
var sleep = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };

/* --- Canvas: roundRect полифилл --- */
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r){
    r = Math.min(r, w / 2, h / 2);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

/* --- Звук (WebAudio синтез) --- */
var AC = null;
var ac = function(){
  if(!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if(AC.state === 'suspended') AC.resume();
  return AC;
};

function tone(f, d, type, vol, slide, delay){
  try{
    var a = ac(), t = a.currentTime + (delay || 0);
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(f, t);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t + d);
    g.gain.setValueAtTime(vol || .12, t);
    g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + d + .03);
  } catch(e){}
}

var sfx = {
  click:   function(){ tone(620, .06, 'square', .06); },
  door:    function(){ tone(210, .16, 'triangle', .12, 80); },
  swing:   function(){ tone(320, .12, 'sawtooth', .08, 130); },
  hit:     function(){ tone(150, .13, 'square', .16, 55); tone(90, .15, 'sawtooth', .08, 40); },
  crit:    function(){ tone(520, .18, 'square', .16, 110); tone(880, .14, 'square', .1, null, .05); },
  hurt:    function(){ tone(120, .26, 'sawtooth', .16, 45); },
  potion:  function(){ tone(420, .1, 'sine', .12, 860); tone(720, .14, 'sine', .1, 1100, .08); },
  gold:    function(){ tone(950, .07, 'square', .09); tone(1350, .1, 'square', .09, null, .08); },
  level:   function(){ [523,659,784,1047].forEach(function(f,i){ tone(f, .14, 'square', .11, null, i * .09); }); },
  win:     function(){ [392,523,659,784].forEach(function(f,i){ tone(f, .18, 'triangle', .13, null, i * .11); }); },
  lose:    function(){ [300,240,180,120].forEach(function(f,i){ tone(f, .22, 'sawtooth', .12, null, i * .14); }); },
  mystic:  function(){ [440,550,660,880].forEach(function(f,i){ tone(f, .22, 'sine', .08, null, i * .1); }); },
  smith:   function(){ tone(180, .1, 'square', .14); setTimeout(function(){ tone(240, .12, 'sawtooth', .12); }, 100); },
  shot:    function(){ tone(90, .2, 'sawtooth', .18, 40); tone(180, .08, 'square', .12); },
  magic:   function(){ tone(660, .2, 'sine', .1, 1320); tone(880, .15, 'sine', .08, null, .1); }
};