var toggle = true;
const intervalLength = 0.06944444444444445;

// blinking colon
setInterval(function(){
  document.getElementById("colon").style.visibility = toggle?"visible":"hidden";
  toggle=!toggle;
}, 1000);

// show time at center
function showTime(){
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  
  document.getElementById("hour").innerText = h;
  document.getElementById("hour").textContent = h;
  
  document.getElementById("minute").innerText = m;
  document.getElementById("minute").textContent = m;
  
  setTimeout(showTime, 1000);
}

function getTimeFromAPI(){
  // ajax request
  /*
    todo:
    1. get city/country name by location
    2. using cache
  */
  var request = new XMLHttpRequest();
  request.open('GET', 'http://api.aladhan.com/v1/timingsByCity?city=kajang&country=malaysia&method=11', true);
  
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var resp = request.responseText;
      
      renderTime( JSON.parse(request.responseText).data.timings );
      showTime();
    } else {
      // We reached our target server, but it returned an error
    }
  };
  
  request.onerror = function() {
    // There was a connection error of some sort
  };
  
  request.send();
}

function getIntervalWaktu(a, z){
  var awal = a.split(':');
  var awal_minutes = (+awal[0]) * 60 + (+awal[1]);
  
  var akhir = z.split(':');
  var akhir_minutes = (+akhir[0]) * 60 + (+akhir[1]);

  var res;
  if (akhir_minutes-awal_minutes < 0){
    res = (akhir_minutes+1440)-awal_minutes;
  } else {
    res = akhir_minutes-awal_minutes;
  }

  res *= intervalLength;

  return res;
}

function renderTime(timings) {
  // hardcoded prayer names (using public API aladhan.com). need to enhance.
  var interval_antarwaktu = {
    'fajr' : getIntervalWaktu(timings['Fajr'], timings['Sunrise']),
    'dhuhr' : getIntervalWaktu(timings['Dhuhr'], timings['Asr']),
    'asr' : getIntervalWaktu(timings['Asr'], timings['Maghrib']),
    'maghrib' : getIntervalWaktu(timings['Maghrib'], timings['Isha']),
    'isha' : getIntervalWaktu(timings['Isha'], timings['Fajr'])
  }

  for(var x in timings){
    if(timings.hasOwnProperty(x)){
      var a = timings[x].split(':');
      var minutes = (+a[0]) * 60 + (+a[1]);
      
      // hardcoded. need to enhance.
      var limaWaktu = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

      if (limaWaktu.indexOf(x.toLowerCase()) > -1 ){
        var indicator = document.getElementsByClassName(x.toLowerCase())[0];
        indicator.style.transform = 'rotate(' + minutes*0.25 + 'deg)';
        indicator.setAttribute('stroke-dasharray', interval_antarwaktu[x.toLowerCase()] + ', 100');
      }
    }
  }

  document.getElementById('clock-container').classList.add('open');
  var els = document.querySelectorAll('.circle');
  for (var i = 0; i < els.length; i++) {
    els[i].classList.add('animate');
  }

  clickListener();
}

function clickListener(){
  var classname = document.getElementsByClassName("circle");
  for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', function(){
      console.log('test', this.getAttribute("stroke-dasharray"));
    });
  }
}

getTimeFromAPI();