(function(){
  'use strict';
  var d=document;
  var rok=d.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  /* menu mobilne */
  var burger=d.getElementById('burger'), menu=d.getElementById('menu');
  function zamknij(){menu.classList.remove('otwarte');d.body.classList.remove('menu-otw');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');}
  burger.addEventListener('click',function(){
    var o=menu.classList.toggle('otwarte');
    d.body.classList.toggle('menu-otw',o);
    burger.setAttribute('aria-expanded',o?'true':'false');
    burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
  });
  menu.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  /* aktywna pozycja menu = dokładnie bieżąca sekcja */
  var linki=[].slice.call(menu.querySelectorAll('a[href^="#"]'));
  var mapa={};linki.forEach(function(a){mapa[a.getAttribute('href').slice(1)]=a;});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(wpisy){
      wpisy.forEach(function(w){
        if(!w.isIntersecting)return;
        linki.forEach(function(a){a.classList.remove('akt');a.removeAttribute('aria-current');});
        var a=mapa[w.target.id]; if(a){a.classList.add('akt');a.setAttribute('aria-current','true');}
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    d.querySelectorAll('main section').forEach(function(s){io.observe(s);});

    var mob=d.getElementById('mob'), ha=d.getElementById('heroAkcje');
    new IntersectionObserver(function(w){
      mob.classList.toggle('widac',!w[0].isIntersecting && w[0].boundingClientRect.top<0);
    }).observe(ha);
  }

  /* tory przesuwane palcem (natywnie) i myszą */
  function ciagnij(tor){
    var x0=0,s0=0,wcisk=false,ruch=0;
    tor.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||e.button!==0)return;
      wcisk=true;ruch=0;x0=e.clientX;s0=tor.scrollLeft;
    });
    window.addEventListener('pointermove',function(e){
      if(!wcisk)return;var dx=e.clientX-x0;ruch=Math.max(ruch,Math.abs(dx));
      if(ruch>4)tor.classList.add('ciag');
      tor.scrollLeft=s0-dx;
    });
    window.addEventListener('pointerup',function(){
      if(!wcisk)return;wcisk=false;tor.classList.remove('ciag');
    });
    tor.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault();});
    tor.addEventListener('keydown',function(e){
      var k=tor.firstElementChild?tor.firstElementChild.getBoundingClientRect().width+30:300;
      if(e.key==='ArrowRight'){e.preventDefault();tor.scrollBy({left:k,behavior:'smooth'});}
      if(e.key==='ArrowLeft'){e.preventDefault();tor.scrollBy({left:-k,behavior:'smooth'});}
    });
  }
  d.querySelectorAll('[data-przewijak]').forEach(ciagnij);

  d.querySelectorAll('.tor-b').forEach(function(b){
    b.addEventListener('click',function(){
      var t=d.getElementById(b.dataset.tor), el=t.firstElementChild;
      var krok=el?(el.getBoundingClientRect().width+40)*2:600;
      t.scrollBy({left:krok*Number(b.dataset.kier),behavior:'smooth'});
    });
  });

  /* formularz pokazowy */
  var f=d.getElementById('formularz'), info=d.getElementById('formInfo');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    info.textContent='To podgląd projektu. Na gotowej stronie formularz wyśle zapytanie na biuro@lfgaleria.pl.';
  });
})();
