//const $ = require('jquery')
let arrVety = undefined;

let btnPrvy = document.getElementById('btn1');
let btnDruhy = document.getElementById('btn2');
let btnTreti = document.getElementById('btn3');
let btnStvrty = document.getElementById('btn4');
let otazka = document.getElementById('otazka');
let bodiky = document.getElementById('bodiky');
let zlych = document.getElementById('zloty');

let totalBodov = 0;
let totalZlych = 0;
let slovnik = [];
let spravnyBtn = 0;
let ktoraOtazka = 0;

$.get( "https://raw.githubusercontent.com/martinujlaky/anglina/master/slovnik.txt", function( cele ) {
  slovnikJSON(cele).then( (data) => {
    slovnik=data;
    davajOtazku();
  });
});

window.open('uvod.html','UVOD','height=300,width=600,top=50');

function slovnikJSON ( data )
{
  let obj = {}; 
  let result = [];
  
  return new Promise ( (resolve, reject) => {

  data.split('\n').forEach( (veta) => {
    let elements = veta.split(';');
    if (elements.length > 2)
    {
      obj = {};
      obj['svk'] = elements[0];
      obj['dfc'] = elements[1];
      obj['typ'] = elements[2];
      obj['eng'] = elements[3]; 
    
      result.push(obj);
    }
  });
  
  resolve (result);
  });

}

function davajOtazku ()
{
  spravnyBtn = Math.floor(Math.random()*4);
  let odpoved = "";
  ktoraOtazka = Math.floor(Math.random()*(slovnik.length));
  let cobolo = [];
  let i = 1;
  let current = 0;

  otazka.innerHTML = 'Ako sa po anglicky povie ' + slovnik[ktoraOtazka]['svk'];
  odpoved = slovnik[ktoraOtazka]['eng'];

  if (spravnyBtn===0) spravnyBtn=1;
  cobolo.push(ktoraOtazka);
  while ( i < 5 )
  {
    current = Math.floor(Math.random()*(slovnik.length));

    if ( !cobolo.includes(current) )
    {
      cobolo.push(current);
      switch(i) {
        case 1: btnPrvy.innerText = slovnik[current]['eng']; break;
        case 2: btnDruhy.innerText = slovnik[current]['eng']; break;
        case 3: btnTreti.innerText = slovnik[current]['eng']; break;
        case 4: btnStvrty.innerText = slovnik[current]['eng']; break;
      }
      i++;
    }
  }

  switch(spravnyBtn) {
    case 1: btnPrvy.innerText = odpoved; break;
    case 2: btnDruhy.innerText = odpoved; break;
    case 3: btnTreti.innerText = odpoved; break;
    case 4: btnStvrty.innerText = odpoved; break;
  }

  btnPrvy.style.visibility = 'visible';
  btnDruhy.style.visibility = 'visible';
  btnTreti.style.visibility = 'visible';
  btnStvrty.style.visibility = 'visible';
  bodiky.innerText = "Pocet dobrych: " + totalBodov;
  bodiky.style.visibility = 'visible';
  zlych.innerText = "Pocet zlych: " + totalZlych;
  zlych.style.visibility = 'visible';
}

function skontroluj ( ktory )
{
  if (spravnyBtn === ktory)
  {
    totalBodov = totalBodov + parseInt(slovnik[ktoraOtazka]['dfc']);  
    bodiky.innerText = "Pocet dobrych: " + totalBodov;
  }
  else
  {
    totalZlych = totalZlych+1;  
    zlych.innerText = "Pocet zlych: " + totalZlych;
  }
  switch(spravnyBtn) {
    case 1: btnPrvy.style.backgroundColor = "Green"; break;
    case 2: btnDruhy.style.backgroundColor = "Green"; break;
    case 3: btnTreti.style.backgroundColor = "Green"; break;
    case 4: btnStvrty.style.backgroundColor = "Green"; break;
  }
  switch(ktory) {
    case 1: if (btnPrvy.style.backgroundColor != "green") btnPrvy.style.backgroundColor = "Red"; break;
    case 2: if (btnDruhy.style.backgroundColor != "green") btnDruhy.style.backgroundColor = "Red"; break;
    case 3: if (btnTreti.style.backgroundColor != "green") btnTreti.style.backgroundColor = "Red"; break;
    case 4: if (btnStvrty.style.backgroundColor != "green") btnStvrty.style.backgroundColor = "Red"; break;
  }
  setTimeout(() => {
    btnPrvy.style.backgroundColor = "";
    btnDruhy.style.backgroundColor = "";
    btnTreti.style.backgroundColor = "";
    btnStvrty.style.backgroundColor = "";
    davajOtazku();
  }, 1000);
  
}

btnPrvy.onclick = function(event) {
  skontroluj(1);
}
btnDruhy.onclick = function(event) {
  skontroluj(2);
}
btnTreti.onclick = function(event) {
  skontroluj(3);
}
btnStvrty.onclick = function(event) {
  skontroluj(4);
}
