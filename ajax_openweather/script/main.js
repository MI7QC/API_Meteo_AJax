/**
 * ajax_openweather
 * Fichier script/main.js
 */
"use strict";


const meteoImg = {
    "Rain": "wi wi-day-rain",
    "Clouds": "wi wi-day-cloudy",
    "Clear": "wi wi-day-cloudy",
    "Snow": "wi wi-day-snow",
    "Mist": "wi wi-day-fog",
    "Drizzle": "wi wi-day-sleet",
    "Thunderstorm": "wi wi-thunderstorm",
    "clear sky": "wi wi-day-cloudy",
    "few clouds": "wi wi-day-cloudy",
    "scattered clouds": "wi wi-day-cloudy",
}

// la premiere lettre d'un mot soit en Majuscule
function lettreMaj(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//Fournir heure au format hh:mm à partir d'un timestamp
const CONV = {
    dt_a_hm: dt => {
        let date = new Date(dt * 1000);
        return ("0" + date.getHours()).substr(-2) + "h" + (date.getMinutes() + "0").substr(0, 2);
    }
}

//Recherche une icone par sont code numérique via le url
const OW_API = {
    base_icon_url: 'http://openweathermap.org/img/w/',

    //http://openweathermap.org/img/w/10d.png
    get_icon_url: function (icon_id) {
        return this.base_icon_url + icon_id + ".png";
    },
};


//Main fonction localiser IP -> trouver ville via IP ->insérer les donné recupérer dans l'url
async function main(avecIp = true) {
    let ville;

    if (avecIp) {
        //1 Récuperer l'adresse IP de l'utilisateur a l'ouverture de la page
        const ip = await fetch('https://api.ipify.org?format=json')
            .then(resultat => resultat.json())
            .then(json => json.ip);

        // access key pour api.ipstack
        var access_key = 'e4e6cacb338614447698c31a63d3ffbc';

        //2 Récupérer de la localisation grace a l'adresse recupérer plus haut
        ville = await fetch('http://api.ipstack.com/' + ip + '?access_key=' + access_key)
            .then(resultat => resultat.json())
            .then(json => json.city);
    } else {
        ville = document.querySelector('#ville').textContent;
    }


    const meteo = await fetch("http://api.openweathermap.org/data/2.5/weather?q=" + ville + "&APPID=d372021858e26c181fc642ca0f0dbd18&units=metric")
        .then(resultat => resultat.json())
        .then(json => json)

    console.log("ceci est meteo 1 : ", meteo);
    //4 afficher les information sur la page
    afficherMeteoInfo(meteo)


    // recupere les données sur le server openweathermap pour avoir meteo sur 5 jours
    const meteo2 = await fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + ville + "&APPID=d372021858e26c181fc642ca0f0dbd18&units=metric")
        .then(resultat => resultat.json())
        .then(json => json)

    console.log("meteo 2 forcast : ", meteo2);
    afficherMeteoInfo2(meteo2)
}


//tous les informations importante pour l'utilisateur
function afficherMeteoInfo(data) {
    const name = data.name;
    const temperature = data.main.temp;
    const conditions = data.weather[0].main;
    const description = data.weather[0].description;

    $('#ville')[0].textContent = name;
    $('#temperature')[0].textContent = Math.round(temperature);
    $('#conditions')[0].textContent = lettreMaj(description);
    $('i.wi')[0].className = meteoImg[conditions];

    document.body.className = conditions.toLowerCase();
}


//Section 2
function afficherMeteoInfo2(data2) {

    var compteur = 0
    var eM = $('.modele');
    for (let item in data2.list) {
        if (compteur >= 12) {
            break;
        }
        $('.heure')[item].innerHTML = CONV.dt_a_hm(data2.list[item]['dt'])
        $('.temperature')[item].innerHTML = Math.round(data2.list[item]['main']['temp'])
        $('.icone')[item].innerHTML = `<img src= "${OW_API.get_icon_url(data2.list[item]["weather"][0].icon)}"/>`
        $('.description')[item].textContent = data2.list[item]['weather']['0']['description']
        eM.clone().insertBefore(eM);
        compteur++;
    }
    $(".modele").last().remove();

}
console.log("$(tbody).innerHTML = ", $('tbody'))

//recuperation de l'id ville
const ville = document.querySelector('#ville');

//Permet d'éditer le champ ville
ville.addEventListener('click', () => {
    ville.contentEditable = true;
});


//Permet a l'aide de la touche Entrer d'envoyer notre confirmation
//remove les tr class modele qui on été créer par clone
//prevenDefault pour pas avoir de saut de ligne
ville.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        for (let i = 0; i < 11; i++) {
            $(".modele").last().remove();
        }
        e.preventDefault();
        ville.contentEditable = false;
        main(false);
    }
})

main();