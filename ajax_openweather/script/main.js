/**
 * ajax_openweather
 * Fichier script/main.js
 */
"use strict";

const meteoImg = {
    "Pluie": "wi wi-day-rain",
    "Clouds": "wi wi-day-cloudy",
    "Clear": "wi wi-day-cloudy",
    "Snow": "wi wi-day-snow",
    "Mist": "wi wi-day-fog",
    "Drizzle": "wi wi-day-sleet",
}

// fait en sorte que la premiere lettre d'un mot soit en Majuscule
function lettreMaj(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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

    console.log(meteo);
    //4 afficher les information sur la page
    afficherMeteoInfo(meteo)

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

    //permet d'avoir un fond d'écrans avec la tendence actuel de la meteo
    document.body.className = conditions.toLowerCase();
}

//recuperation de la id ville
const ville = document.querySelector('#ville');

//Permet d'éditer le champ ville
ville.addEventListener('click', () => {
    ville.contentEditable = true;
});


//Permet a l'aide de la touche Enter d'envoyer notre confirmation
//prevenDefault pour pas avoir de saut de ligne
ville.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        ville.contentEditable = false;
        main(false);
    }
})

main();








