/**
 * ajax_openweather
 * Fichier script/main.js
 */
"use strict";

// Pour convertir °K -> °C : °C = °K - 273.15
const ZERO_ABS = -273.15;

/**
 * Réaliser quelques conversion utiles
 */
const CONV = {
    /**
     * Convertir °K -> °C
     */
    k_a_c : k => (k + ZERO_ABS).toFixed(1),

    /**
     * Fournir heure au format hh:mm à partir d'un timestamp
     */
    dt_a_hm : dt => {
        let date = new Date(dt * 1000);
        return ("0" + date.getHours()).substr(-2) + "h" + (date.getMinutes() + "0").substr(0,2);
    }

}

/**
 * Latitude et longitude de la ville de montréal 
 */
const MONTREAL = {
    lat : 45.508320,     
    lon : -73.566431,     
};

/**
 * Petit objet pour gérer les URLs de l'API 
 */
const OW_API = {
    base_api_url : 'http://api.openweathermap.org/data/2.5/',
    base_icon_url : 'http://openweathermap.org/img/w/',
    weather : 'weather?lat={lat}&lon={lon}',
    forecast : 'forecast?lat={lat}&lon={lon}',
    key : '&APPID=d372021858e26c181fc642ca0f0dbd18',

    //http://api.openweathermap.org/data/2.5/weather?lat=45.508320&lon=-73.566431&appid=d372021858e26c181fc642ca0f0dbd18
    get_weather_url : function(lat, lon) {
        return this.base_api_url + this.weather.replace('{lat}', lat).replace('{lon}', lon) + this.key;
    },

    //http://api.openweathermap.org/data/2.5/forecast?lat=45.508320&lon=-73.566431&appid=d372021858e26c181fc642ca0f0dbd18
    get_forecast_url : function(lat, lon) {
        return this.base_api_url + this.forecast.replace('{lat}', lat).replace('{lon}', lon) + this.key;
    },

    //http://openweathermap.org/img/w/10d.png
    get_icon_url : function(icon_id) {
        return this.base_icon_url + icon_id + ".png";
    },
};
