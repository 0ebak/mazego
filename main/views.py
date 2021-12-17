import requests
from django.shortcuts import render
from datetime import datetime
import pytz
from translate import Translator
from bs4 import BeautifulSoup
import json
import re


def index(request):
    appid = "b2b4026430f458f959496f2c559436d8"
    url = "http://api.openweathermap.org/data/2.5/weather?q={}&units=metric&appid=" + appid + "&lang=ru"
    city = "Санкт-Петербург"
    if request.method == 'POST':
        city = request.POST['city']
    if city == "":
        city = "Лондон"

    res = requests.get(url.format(city)).json()

    city_info = {
        'city': city,
        'temp': res["main"]["temp"],
        'icon': res["weather"][0]["icon"]
    }

    translator = Translator(from_lang='Russian', to_lang='English')
    city = translator.translate(city)
    city = city.lower()
    if city == 'st petersburg':
        city = 'saint petersburg'
    context = {"info": city_info, "news": get_news(city.replace('-', '_').replace(' ', '_')),
               'currency': get_currency(["USD", "EUR", "KZT"]), 'cinema': get_cinema(city.replace(' ', '-'))}

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
        return ("evening.jpg")
    else:
        return "night.jpg"


def get_cinema(city):
    url = 'https://afisha.yandex.ru/' + city + '?source=menu-city'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'lxml')
    cinemas = soup.find_all(class_="i-react event-card-react i-bem")
    list_of_cinemas = []
    for cinema in cinemas:
        ivent = json.loads(cinema.get('data-bem'))['event-card-react']['props']
        if ivent['type'] == 'cinema':
            list_of_cinemas.append(ivent)

    try:
        finish_list = []
        for i in 0, 1, 2:
            try:
                finish_list.append({'image': list_of_cinemas[i]['image']['url'], 'title': list_of_cinemas[i]['title'],
                                        'description': list_of_cinemas[i]['argument'], 'rating': list_of_cinemas[i]['rating']['value']})
            except TypeError:
                finish_list.append({'image': list_of_cinemas[i]['image']['url'], 'title': list_of_cinemas[i]['title'],
                                    'description': list_of_cinemas[i]['argument'],
                                    'rating': 'No'})

        return finish_list
    except IndexError:
        print("\nCAPTCHA at cinema\n")
        return [{'image': 'image', 'title': 'title', 'description': 'argument', 'rating': 'rating'}]


get_cinema('moscow')

def get_news(city):
    url = 'https://yandex.ru/news/region/' + city
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'lxml')
    list_of_pictures = soup.find_all("div", class_="mg-card__media-block mg-card__media-block_type_image")[:4]
    list_of_pictures = list_of_pictures[:4]
    list_of_links = soup.find_all(class_="mg-card__text")[:4]
    list_of_titles = soup.find_all("h2", class_="mg-card__title")[1:5]
    news_list = []

    try:
        for i in 0, 1, 2, 3:
            picture = re.search(r"(?<=url\().*(?=\))", list_of_pictures[i]["style"]).group(0)
            title = list_of_titles[i].text
            link = list_of_links[i].find('a')['href']
            news_list.append({'picture': picture, 'title': title, 'link': link})
        return news_list

    except IndexError:
        print("\nCAPTCHA at news\n")
        return [{'picture': '', 'title': '', 'link': ''}]


def get_currency(code_list):
    url = 'https://www.cbr.ru/currency_base/daily/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'lxml')
    list_of_currency = soup.find_all("tr")
    final_list_of_currency = []
    for currency in list_of_currency:
        current_code = list(currency)[3].text
        if current_code in code_list:
            quantity = list(currency)[5].text
            name = list(currency)[7].text
            value = list(currency)[9].text
            final_list_of_currency.append({'current_code': current_code, 'quantity': quantity, 'name': name,
                                           'value': value})
    return final_list_of_currency

