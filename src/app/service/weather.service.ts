import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../global/global'

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  public getWeather(city, units, days) {
    return this.http.get(`${URL_API}getTempCity/${city}/${units}/${days}`);
  }
  public getWeatherByDate(city, units, startDate, endDate) {
    return this.http.get(`${URL_API}getCityDate/${city}/${units}/${startDate}/${endDate}`);
  }
  public getCities() {
    return this.http.get(`${URL_API}getCities`);
  }
  public getScale() {
    return this.http.get(`${URL_API}getScales`);
  }

}
