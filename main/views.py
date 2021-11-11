import requests
from django.shortcuts import render
from translate import Translator
from datetime import datetime
import pytz


def index(request):
    appid = "b2b4026430f458f959496f2c559436d8"
    url = "http://api.openweathermap.org/data/2.5/weather?q={}&units=metric&appid=" + appid

    time_ref = "night.jpg"

    city = "London"
    if request.method == 'POST':
        city = request.POST['city']
    if city == "":
        city = "London"

    translator = Translator(from_lang='Russian', to_lang='English')
    city = translator.translate(city)

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

# функция для изменения фона в зависимости от времени
def get_picture():
    tz = pytz.timezone('Europe/Moscow')
    current_datetime = datetime.now(tz)

    if current_datetime.hour > 6 and current_datetime.hour < 12:
        return "morning.jpg"
    elif current_datetime.hour > 12 and current_datetime.hour < 18:
        return "day.jpg"
    elif current_datetime.hour > 18:
        return("evening.jpg")
    else:
        return "night.jpg"

