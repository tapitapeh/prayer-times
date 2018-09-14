var toggle = true;

setInterval(function(){
  document.getElementById("colon").style.visibility = toggle?"visible":"hidden";
  toggle=!toggle;
}, 1000);

function showTime(){
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  
  var time = h + ":" + m;
  document.getElementById("hour").innerText = h;
  document.getElementById("hour").textContent = h;
  
  document.getElementById("minute").innerText = m;
  document.getElementById("minute").textContent = m;
  
  setTimeout(showTime, 1000);
}


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

function getIntervalWaktu(awal, akhir){
  var a = awal.split(':');
  var a_minutes = (+a[0]) * 60 + (+a[1]);
  
  var z = akhir.split(':');
  var z_minutes = (+z[0]) * 60 + (+z[1]);

  var res;
  if (z_minutes-a_minutes < 0){
    res = (z_minutes+1440)-a_minutes;
  } else {
    res = z_minutes-a_minutes;
  }

  res *= 0.06944444444444445;

  return res;
}

function renderTime(timings) {
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
      
      // hardcoded
      var limaWaktu = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

      if (limaWaktu.indexOf(x.toLowerCase()) > -1 ){
        var indicator = document.getElementsByClassName(x.toLowerCase())[0];
        indicator.style.transform = 'rotate(' + minutes*0.25 + 'deg)';

        var indi_path = indicator.querySelector('path');
        indi_path.setAttribute('stroke-dasharray', interval_antarwaktu[x.toLowerCase()] + ', 100');
      }
    }
  }

  document.getElementById('clock-container').classList.add('open');
  var els = document.querySelectorAll('.circle');
  for (var i = 0; i < els.length; i++) {
    els[i].classList.add('animate')
  }

  clickListener();
}

function clickListener(){
  var classname = document.getElementsByClassName("circular-chart");
  for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', function(){
      console.log('test', this.getAttribute("style"));
    });
  }
}