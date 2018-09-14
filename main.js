function showTime(){
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  
  var time = h + ":" + m;
  document.getElementById("clock").innerText = time;
  document.getElementById("clock").textContent = time;
  
  setTimeout(showTime, 1000);
  
}

showTime();

function getPrayerTimes(){
  var times = {
    'imsak': '05:39',
    'subuh': '05:49',
    'syuruk': '07:03',
    'dhuha': '07:27',
    'zohor': '13:12',
    'asar': '16:12',
    'maghrib': '19:15',
    'isyak': '20:24'
  }
}