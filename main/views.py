import requests
from django.shortcuts import render


def index(request):
    appid = "b2b4026430f458f959496f2c559436d8"
    url = "http://api.openweathermap.org/data/2.5/weather?q={}&units=metric&appid=" + appid

    city = "London"
    if request.method == 'POST':
        city = request.POST#breaks there

    res = requests.get(url.format(city)).json()

    city_info = {
        'city': city,
        'temp': res["main"]["temp"],
        'icon': res["weather"][0]["icon"]
    }

    context = {"info": city_info}

    return render(request, 'main/index.html', context)


def about(request):
    return render(request, 'main/about.html')


def game(request):
    return render(request, 'main/game.html')
