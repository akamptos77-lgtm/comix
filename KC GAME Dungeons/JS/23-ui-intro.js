'use strict';
/* 23-UI-INTRO: анимированная комикс-заставка (пропускаемая) */
var INTRO_SLIDES=[
{img:'img/intro1.png',cap:'Десять миров жили в мире под защитой Печати Зари...'},
{img:'img/intro2.png',cap:'Но ПОЖИРАТЕЛЬ МИРОВ разорвал печать! Он поглощает миры один за другим.'},
{img:'img/intro3.png',cap:'Старец указал путь: чудовище скрылось в Великом Подземелье. Семь героев клянутся вернуть свет.'},
{img:'img/intro4.png',cap:'Сто этажей тьмы. Тысячи монстров. Одна надежда. Спустись и останови Пожирателя!'}
];
var introTimer=null,introIdx=0;
function showIntroSlide(n){
  var s=INTRO_SLIDES[n];
  var img=$('#intro-img');if(img)img.src=s.img;
  var cap=$('#intro-cap');if(cap)cap.textContent=s.cap;
  var cnt=$('#intro-count');if(cnt)cnt.textContent=(n+1)+' / '+INTRO_SLIDES.length;
  var p=$('#intro-panel');
  if(p){p.classList.remove('anim');void p.offsetWidth;p.classList.add('anim');}
  sfx.mystic();
}
function closeIntro(){
  if(introTimer){clearInterval(introTimer);introTimer=null;}
  var o=$('#ovl-intro');if(o)o.classList.remove('on');
}
function playIntro(){
  var ovl=$('#ovl-intro');if(!ovl)return;
  introIdx=0;
  ovl.classList.add('on');
  showIntroSlide(0);
  introTimer=setInterval(function(){
    introIdx++;
    if(introIdx>=INTRO_SLIDES.length)closeIntro();
    else showIntroSlide(introIdx);
  },5000);
}
function initIntro(){
  var skip=$('#intro-skip');
  if(skip)skip.onclick=function(e){e.stopPropagation();closeIntro();};
  var panel=$('#intro-panel');
  if(panel)panel.onclick=function(){
    introIdx++;
    if(introIdx>=INTRO_SLIDES.length)closeIntro();
    else showIntroSlide(introIdx);
  };
  var replay=$('#btn-intro');
  if(replay)replay.onclick=function(){playIntro();};
  playIntro();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initIntro);
else initIntro();