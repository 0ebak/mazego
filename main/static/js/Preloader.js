document.body.onload = function() {
    setTimeout(function() {
        var preloader = document.getElementById('page-preloader');
        if( !preloader.classList.contains('done') )
        {
            preloader.classList.add('done');
        }
    }, 1000);

    window.setInterval(function() {
                const header = document.getElementById('header');
                var date = new Date();

                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                if (hours < 10) {
                    hours = hours.toString();
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = minutes.toString();
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = seconds.toString();
                    seconds = "0" + seconds;
                }

                var clock = hours + ":" + minutes + ":" + seconds;
                document.getElementById("clock").innerHTML = clock;

                var hour = parseInt(hours.toString() + minutes);

                if (hour >= 500 && hour < 1200) {
                    header.style.background = "url(../static/css/morning.jpg)";
                    header.style.backgroundPosition = "center";
                    header.style.backgroundSize = "cover";
                }
                if (hour >= 1200 && hour < 1800) {
                    header.style.background = "url(../static/css/day.jpg)";
                    header.style.backgroundSize = "cover";
                }
                if (hour >= 1800 && hour < 2359) {
                    header.style.background = "url(../static/css/evening.jpg)";
                    header.style.backgroundSize = "cover";
                }
                if (hour >= 000 && hour < 500) {
                    header.style.background = "url(../static/css/night.jpg)";
                    header.style.backgroundSize = "cover";
                }
            }
    );
}
