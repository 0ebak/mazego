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
                var dots = document.getElementsByClassName("dot");
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
                    body.style.background = "url(../static/css/morning.jpg)";
                    body.style.opacity = 1;
                }
                if (hour >= 1200 && hour < 1800) {
                    header.style.background = "url(../static/css/day.jpg)";
                    body.style.background = "url(../static/css/day.jpg)";
                    body.style.opacity = 1;
                }
                if (hour >= 1800 && hour < 2359) {
                    header.style.background = "url(../static/css/evening.jpg)";
                    body.style.background = "url(../static/css/evening.jpg)";
                    body.style.opacity = 1;
                }
                if (hour >= 000 && hour < 500) {
                    header.style.background = "url(../static/css/night.jpg)";
                    body.style.background = "url(../static/css/night.jpg)";
                    body.style.opacity = 1;
                }
            }
    );
}

var slideIndex = 1;
showSlide(slideIndex);

function plusSlide(n) {
    showSlide(slideIndex += n);
}

function currentSlide(n) {
    showSlide(slideIndex = n);
}

function showSlide(n) {
    var i;
    var slides = document.getElementsByClassName("slides");
    var dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0;  i < dots.length; i++) {
        dots[i].className = dots[i].className.replace("active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}
