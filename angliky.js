//const $ = require('jquery')
let arrVety = undefined;

let btnPrvy = document.getElementById('btn1');
let btnDruhy = document.getElementById('btn2');
let btnTreti = document.getElementById('btn3');
let btnStvrty = document.getElementById('btn4');
let otazka = document.getElementById('otazka');
let bodiky = document.getElementById('bodiky');
let zlych = document.getElementById('zloty');
let selTyp = document.getElementById('selTyp');
let selDfc = document.getElementById('selDfc');

let totalBodov = 0;
let totalZlych = 0;
let slovnikCely = [];
let slovnikVybrany = [];
let spravnyBtn = 0;
let ktoraOtazka = 0;
let option = undefined;
let typIdx = 2;
let dfcIdx = 2;


$.get( "https://raw.githubusercontent.com/martinujlaky/anglina/master/slovnik.txt", function( cele ) {
  vytvorSlovnikzFilu(cele).then( (data) => {
    slovnikCely=data;
    slovnikVybrany=data;
    vyplnComboboxe();
    davajOtazku(slovnikVybrany);
  });
});

window.open('uvod.html','UVOD','height=300,width=600,top=50');


function vytvorSlovnikzFilu ( data )
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

function davajOtazku (slovnik)
{
  spravnyBtn = Math.floor(Math.random()*4);
  let odpoved = "";
  ktoraOtazka = Math.floor(Math.random()*(slovnik.length));
  let cobolo = [];
  let i = 1;
  let current = 0;
  let odpovIdx = ""

  // zistime ci bude zo SVK -> ANJ abo ANJ -> SVK 
  if ( Math.floor(Math.random()*2) == 0 )
  {
    otazka.innerHTML = 'Ako sa po anglicky povie "' + slovnik[ktoraOtazka]['svk'] + '"';
    odpovIdx = 'eng';
    odpoved = slovnik[ktoraOtazka][odpovIdx];
  }
  else
  {
    otazka.innerHTML = 'Co v anglictine znamena "' + slovnik[ktoraOtazka]['eng'] + '"';
    odpovIdx = 'svk';
    odpoved = slovnik[ktoraOtazka][odpovIdx];
  }

  if (spravnyBtn===0) spravnyBtn=1;
  cobolo.push(ktoraOtazka);
  while ( i < 5 )
  {
    current = Math.floor(Math.random()*(slovnik.length));

    if ( !cobolo.includes(current) )
    {
      cobolo.push(current);
      switch(i) {
        case 1: btnPrvy.innerText = slovnik[current][odpovIdx]; break;
        case 2: btnDruhy.innerText = slovnik[current][odpovIdx]; break;
        case 3: btnTreti.innerText = slovnik[current][odpovIdx]; break;
        case 4: btnStvrty.innerText = slovnik[current][odpovIdx]; break;
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
    totalBodov = totalBodov + parseInt(slovnikVybrany[ktoraOtazka]['dfc']);  
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
    davajOtazku(slovnikVybrany);
  }, 1000);
  
}

function vyplnComboboxe() 
{
  let typDist = [];
  let dfcDist = [];

  typDist = slovnikCely.reduce( (obj, line) => { 
    obj.push( line.typ );
    return obj;
    }, [] )
  .filter ( (value, index, self) => { return self.indexOf(value) === index } )
  ;

  typDist.forEach( (t) => { 
    option = document.createElement('option');
    option.innerText = t;
    selTyp.add(option, typIdx);
    typIdx++; 
  });


  dfcDist = slovnikCely.reduce( (obj, line) => { 
    obj.push( line.dfc );
    return obj;
    }, [] )
  .filter ( (value, index, self) => { return self.indexOf(value) === index } )
  ;

  dfcDist.forEach( (t) => { 
    option = document.createElement('option');
    option.innerText = t;
    selDfc.add(option, dfcIdx);
    dfcIdx++; 
  });

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

selDfc.onchange = function(event) {
  selTyp.value = "Vsetko"
  if (event.target.value == "Vsetko")
    slovnikVybrany = slovnikCely
  else
    slovnikVybrany = slovnikCely.filter( (item) => { 
      return item.dfc == event.target.value 
    });
  davajOtazku(slovnikVybrany); 
};

selTyp.onchange = function(event) {
  selDfc.value = "Vsetko"
  if (event.target.value == "Vsetko")
    slovnikVybrany = slovnikCely
  else
    slovnikVybrany = slovnikCely.filter( (item) => { 
      return item.typ == event.target.value 
    });
  davajOtazku(slovnikVybrany); 
};
