'use strict';
function hasRelic(id){return G.relics&&G.relics.indexOf(id)>=0;}
function effCd(v){return Math.max(1,v-(hasRelic('hourglass')?1:0));}
function phoenixReady(){return G.phoenixCd<=0;}
function eqBonus(k){var e=G.hero.equip,s=0;for(var sl in e)if(e[sl]&&e[sl].b[k])s+=e[sl].b[k]*(1+(e[sl].up||0)*.25);return Math.round(s*100)/100;}
function pAtk(){return Math.max(1,Math.round(G.hero.atk+G.hero.stats.str*2+eqBonus('atk')));}
function pDef(){var d=Math.round(G.hero.def+eqBonus('def'));if(hasRelic('dragonscale'))d+=2;return d;}
function pMaxHp(){var hp=Math.round(G.hero.maxHp+G.hero.stats.vit*15+eqBonus('hp'));if(hasRelic('dragonscale'))hp+=10;if(hasRelic('berskull'))hp=Math.round(hp*.9);return hp;}
function pCrit(){var c=G.hero.crit+G.hero.stats.agi*3+eqBonus('crit');if(cardsDone())c+=5;return Math.round(c*10)/10;}
function pDodge(){var d=G.hero.stats.agi*2+eqBonus('dodge')+G.hero.spd*.5;if(hasRelic('swiftboot'))d+=3;if(cardsDone())d+=5;var bfx=getBiomeFx();if(bfx&&bfx.dodge)d+=bfx.dodge;if(G.hero.dodgePenalty)d-=G.hero.dodgePenalty;return Math.round(Math.max(0,d)*10)/10;}
function pVamp(){var v=G.hero.vamp+eqBonus('vamp');if(hasRelic('vamp_heart'))v+=.05;return Math.round(v*100)/100;}
function pSkillPow(){return 1+G.hero.stats.int*.1;}
function pPotionPow(){return .5+G.hero.stats.int*.05;}
function clampHp(){G.hero.hp=Math.min(G.hero.hp,pMaxHp());}
function getHeroAtk(){var a=pAtk();if(G.hero.buffs.atk>0)a=Math.round(a*1.5);if(G.hero.buffs.rage>0)a=Math.round(a*1.3);if(hasRelic('berskull'))a=Math.round(a*1.1);return a;}
function getHeroDef(){return Math.round(pDef()*(G.hero.buffs.def>0?1.5:1));}
function getHeroDodge(){return pDodge()+(G.hero.buffs.dodge>0?25:0);}
function getHeroCrit(){var c=pCrit();if(G.hero.buffs.crit>0)c*=2;return c;}
function buffHero(stat,turns){G.hero.buffs[stat]=Math.max(G.hero.buffs[stat]||0,turns);addFloat(225,180,'⬆','#7ef29a');log('Бафф: '+stat);sfx.mystic();}
function cleanseHero(){G.hero.poison=null;G.hero.burn=null;addFloat(225,200,'✨','#7ef29a');log('Негатив снят!');sfx.potion();}
function shieldHero(){G.hero.shield=true;addFloat(225,200,'🛡','#9fd8ff');log('Щит активен!');sfx.click();}
function stunEnemy(turns){var e=G.enemy;if(!e)return;if(e.boss)turns=Math.min(1,turns);e.stun=(e.stun||0)+turns;addFloat(700,190,'💫','#ffd23d');log('Враг оглушён!');}
function poisonEnemy(turns,dmg){var e=G.enemy;if(!e)return;e.poison={turns:turns,dmg:dmg};addFloat(700,260,'☠','#b6ff5e');log('Враг отравлен!');}
function burnEnemy(turns,dmg){var e=G.enemy;if(!e)return;e.burn={turns:turns,dmg:dmg};addFloat(700,260,'🔥','#ff8b4a');log('Враг горит!');}
function freezeEnemy(dmg){var e=G.enemy;if(!e)return;e.hp=Math.max(0,e.hp-dmg);if(e.hp<=0)e.dead=true;e.frozen=(e.frozen||0)+1;addFloat(700,230,'−'+dmg,'#9fd8ff');log('Заморозка!');}
function healHero(pct){var hl=Math.round(pMaxHp()*pct);G.hero.hp=Math.min(pMaxHp(),G.hero.hp+hl);addFloat(225,210,'+'+hl,'#7ef29a');addParts(225,240,'#7ef29a',10);sfx.potion();updateHUD();return hl;}
function enemyReact(phrases){var e=G.enemy;if(!e||e.dead)return;fx.bubbles.push({x:700,y:120,txt:pick(phrases),t:0,life:1.6});}