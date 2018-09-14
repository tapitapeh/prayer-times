var toggle = true;
function showTime(){
  setInterval(function(){

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
    
    document.getElementById("colon").style.visibility = toggle?"visible":"hidden";
    toggle=!toggle;
  }, 1000);
  
  // setTimeout(showTime, 1000);
  
}

showTime();

var request = new XMLHttpRequest();
request.open('GET', 'http://api.aladhan.com/v1/timingsByCity?city=kajang&country=malaysia&method=11', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var resp = request.responseText;

    console.log(JSON.parse(request.responseText) );
    renderTime( JSON.parse(request.responseText).data.timings );
  } else {
    // We reached our target server, but it returned an error

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();

function renderTime(timings) {
  console.log(timings);
  for(var x in timings){
    if(timings.hasOwnProperty(x)){
      var a = timings[x].split(':');
      var minutes = (+a[0]) * 60 + (+a[1]);
      // hardcoded
      var limaWaktu = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      if (limaWaktu.indexOf(x.toLowerCase()) > -1 ){
        var indicator = document.getElementsByClassName(x.toLowerCase())[0];
        indicator.style.transform = 'rotate(' + minutes*0.25 + 'deg)';
      }

      // 0.25*minutes to set prayer time
    }
  }
}