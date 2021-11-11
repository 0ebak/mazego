import requests
from django.shortcuts import render
from translate import Translator
from datetime import datetime
import pytz
from bs4 import BeautifulSoup
import json

def index(request):
    appid = "b2b4026430f458f959496f2c559436d8"
    url = "http://api.openweathermap.org/data/2.5/weather?q={}&units=metric&appid=" + appid

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
    print(current_datetime.hour)
    if current_datetime.hour > 6 and current_datetime.hour < 12:
        return "morning.jpg"
    elif current_datetime.hour > 12 and current_datetime.hour < 18:
        return "day12.jpg"
    elif current_datetime.hour > 18:
        return("evening.jpg")
    else:
        return "night.jpg"


def get_cinema(city):
    url = 'https://afisha.yandex.ru/'+city.lower()+'/selections/all-events-cinema'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'lxml')
    cinemas = soup.find_all('script', type="application/ld+json")
    cinemas = json.loads(list(cinemas)[0].text)
    for cinema in cinemas:
        name = cinema['name']
        try:
            rating = cinema['aggregateRating']['ratingValue']
            print(name, '-', rating)
        except KeyError:
            print(name, '- no rating', )
