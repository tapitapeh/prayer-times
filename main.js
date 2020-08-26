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
  /*
    - Malaysia location only. Thanks to Ilhami (i906) for the API
  */

  var request = new XMLHttpRequest();

  request.open('GET', 'https://mpt.i906.my/api/prayer/' + lat + ',' + lng, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      var resp = request.responseText;

      renderTime(JSON.parse(resp).data.times);

      document.getElementById("_place").innerText = JSON.parse(resp).data.place;
      document.getElementById("_place").textContent = JSON.parse(resp).data.place;

      showTime();

      var storageData = JSON.parse(resp).data;
      storageData['expired'] = getTodayDate(true);
    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function () {
    // There was a connection error of some sort
  };

  request.send();
}

function getTimeInterval (a, z) {
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

  var today = new Date();

  var prayer_today = timings[today.getDate() - 1];
  var waktu = [];
  for (var i = 0; i < prayer_today.length; i++) {
    var date = new Date(prayer_today[i] * 1000);

    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();

    // Will display time in 10:30 format
    var formattedTime = hours + ':' + minutes.substr(-2);
    waktu.push(formattedTime);
  }

  var prayers = [
    {
      name: 'fajr',
      interval: getTimeInterval(waktu[0], waktu[1]),
      time: waktu[0]
    },
    {
      name: 'sunrise',
      interval: getTimeInterval(waktu[1], waktu[2]),
      time: waktu[1]
    },
    {
      name: 'dhuhr',
      interval: getTimeInterval(waktu[2], waktu[3]),
      time: waktu[2]
    },
    {
      name: 'asr',
      interval: getTimeInterval(waktu[3], waktu[4]),
      time: waktu[3]
    },
    {
      name: 'maghrib',
      interval: getTimeInterval(waktu[4], waktu[5]),
      time: waktu[4]
    },
    {
      name: 'isha',
      interval: getTimeInterval(waktu[5], waktu[0]),
      time: waktu[5]
    },
  ]

  for (var x in prayers) {
    var a = prayers[x].time.split(':');
    var minutes = (+a[0]) * 60 + (+a[1]);

    if (prayers[x].name != 'sunrise') {
      var indicator = document.getElementsByClassName(prayers[x].name)[0];
      indicator.style.transform = 'rotate(' + minutes * 0.25 + 'deg)';
      indicator.setAttribute('stroke-dasharray', prayers[x].interval + ', 100');
      indicator.setAttribute('data-time', prayers[x].time);
      indicator.setAttribute('data-name', prayers[x].name);

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