var toggle = true;
const intervalLength = 0.06944444444444445;
const storageName = 'prayertimes24h' + getTodayDate();

var timer1, timer2, timer3;

var lat, lng;

// blinking colon
setInterval(function () {
  document.getElementById("colon").style.visibility = toggle ? "visible" : "hidden";
  toggle = !toggle;
}, 1000);

// show time at center
function showTime () {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59

  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;

  document.getElementById("hour").innerText = h;
  document.getElementById("hour").textContent = h;

  document.getElementById("minute").innerText = m;
  document.getElementById("minute").textContent = m;

  var minutes = parseFloat(h) * 60 + parseFloat(m);
  document.getElementById("circle-now").style.transform = 'rotate(' + minutes * 0.25 + 'deg)';

  setTimeout(showTime, 1000);
}

function getTime (lat, lng) {
  // chrome.storage.sync.get('prayertimes24h', function (data) {
  //   if (!isEmpty(data) && !isExpired(getTodayDate(), data[Object.keys(data)[0]].expired)) {
  //     renderTime(data[Object.keys(data)[0]].timings);
  //     showTime();
  //   } else {
  var request = new XMLHttpRequest();
  /*
    - this API not 100% accurate. need better method like muslimpro.com
    - hardcoded location. need to implement geolocation
  */
  // request.open('GET', 'http://api.aladhan.com/v1/timingsByCity?city=pekanbaru&country=indonesia&method=11', true);
  request.open('GET', 'https://mpt.i906.my/api/prayer/' + lat + ',' + lng, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      var resp = request.responseText;

      console.log('request.responseText: ', JSON.parse(request.responseText).data);
      // renderTime(JSON.parse(request.responseText).data.timings);
      // showTime();

      var storageData = JSON.parse(request.responseText).data;
      storageData['expired'] = getTodayDate(true);

      // chrome.storage.sync.clear();
      // chrome.storage.sync.set({ 'prayertimes24h': storageData })
    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function () {
    // There was a connection error of some sort
  };

  request.send();
  //   }
  // });
}

function getIntervalWaktu (a, z) {
  var awal = a.split(':');
  var awal_minutes = (+awal[0]) * 60 + (+awal[1]);

  var akhir = z.split(':');
  var akhir_minutes = (+akhir[0]) * 60 + (+akhir[1]);

  var res;
  if (akhir_minutes - awal_minutes < 0) {
    res = (akhir_minutes + 1440) - awal_minutes;
  } else {
    res = akhir_minutes - awal_minutes;
  }

  res *= intervalLength;

  return res;
}

function renderTime (timings) {
  // hardcoded prayer names (using public API aladhan.com). need to enhance.
  var interval_antarwaktu = {
    'fajr': getIntervalWaktu(timings['Fajr'], timings['Sunrise']),
    'dhuhr': getIntervalWaktu(timings['Dhuhr'], timings['Asr']),
    'asr': getIntervalWaktu(timings['Asr'], timings['Maghrib']),
    'maghrib': getIntervalWaktu(timings['Maghrib'], timings['Isha']),
    'isha': getIntervalWaktu(timings['Isha'], timings['Fajr'])
  }

  for (var x in timings) {
    if (timings.hasOwnProperty(x)) {
      var a = timings[x].split(':');
      var minutes = (+a[0]) * 60 + (+a[1]);

      // hardcoded. need to enhance.
      var limaWaktu = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

      if (limaWaktu.indexOf(x.toLowerCase()) > -1) {
        var indicator = document.getElementsByClassName(x.toLowerCase())[0];
        indicator.style.transform = 'rotate(' + minutes * 0.25 + 'deg)';
        indicator.setAttribute('stroke-dasharray', interval_antarwaktu[x.toLowerCase()] + ', 100');
        indicator.setAttribute('data-time', timings[x]);
        indicator.setAttribute('data-name', x);
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

function clickListener () {
  var classname = document.getElementsByClassName("circle");
  for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', function () {
      // need better solution. this one seems messy.
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      document.getElementById('prayer-time-clock__name').className = "";
      document.getElementById('prayer-time-clock__name').classList.add(this.getAttribute('data-name').toLowerCase());

      document.getElementById("prayer-time-clock__name").innerText = this.getAttribute('data-name');
      document.getElementById("prayer-time-clock__name").textContent = this.getAttribute('data-name');

      document.getElementById("prayer-time-clock__time").innerText = this.getAttribute('data-time');
      document.getElementById("prayer-time-clock__time").textContent = this.getAttribute('data-time');

      document.getElementById('clock-container').classList.remove('open');
      timer1 = setTimeout(function () {
        document.getElementById('prayer-time-clock').classList.add('open');
        timer2 = setTimeout(function () {
          document.getElementById('prayer-time-clock').classList.remove('open');
          timer3 = setTimeout(function () {
            document.getElementById('clock-container').classList.add('open');
          }, 100);
        }, 2000);
      }, 100);
    });
  }
}

function getTodayDate (tomorrow) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (tomorrow) ++dd;

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  return dd + mm + yyyy;
}

function isEmpty (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

function isExpired (a, b) {
  if (a === b) return true;
  return false;
}

function getLocation () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    console.log('navigator.geolocation.getCurrentPosition: ', navigator.geolocation);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition (position) {
  console.log('position.coords: ', position.coords);
  lat = position.coords.latitude;
  lng = position.coords.longitude;

  getTime(lat, lng);
}

// getTime();
getLocation();