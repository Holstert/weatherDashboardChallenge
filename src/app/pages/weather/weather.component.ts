import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/service/weather.service';
import { city } from 'src/app/interfaces/city';
import { scale } from 'src/app/interfaces/scale';

import * as $ from 'jquery';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  //Graph
  private reDrawGraph:boolean = false;
  private linesGraph = [];
  private dateToDraw = [];
  
  private dateStart: Date = new Date();
  dateNow:string = ""; 
  
  private _cities: city[] = [];
  private _citiesToShow = [];
  private _citiesToSend = [];
  private _citiesSelected = [];

  private _scales: scale[] = [];
  private _scale:string;

  private _days:number;

  constructor (private _weatherService: WeatherService) { 
    this._days = 15;
    this._scale = "I";
    this.dateNow = `${this.dateStart.getFullYear()}-${('0' + (this.dateStart.getMonth() + 1)).slice(-2)}-${('0'+this.dateStart.getDate()).slice(-2)}`
  }
  
  ngOnInit() {
    this.getCities();
    this.getScales();
    this.addDateToGraph(this.dateStart)
    this.sendCitiesToGraph(this._citiesToSend)
  }

  getWeather($city) {
    this._weatherService.getWeather($city, this._scale, this._days).subscribe((data:any) => {
      this.funReDrawGraph(false)
      let dataTemp = data.data.map((item) => {
        return item.data
      });

      this.addCityInfoTable(data);
      this.addLineToGraph({data: dataTemp, label: data.city_name})

      setTimeout(() => {
        this.funReDrawGraph(true)
      })
    });
  }
  addLineToGraph($item) {  
    this._citiesToSend.push($item);
    this.linesGraph = this._citiesToSend;
  }
  addCityInfoTable(data) {
    this._citiesToShow.push({data: data, label: data.city_name});
  }
  getCities() {
    this._weatherService.getCities().subscribe((data:city[]) => {
      this._cities = data;
    });
  }
  getScales() {
    this._weatherService.getScale().subscribe((data:scale[]) => {
      this._scales = data;
    })
  }
  addDateToGraph($date) {
    this.funReDrawGraph(false);
    this.dateToDraw = []
    const date = new Date($date); 
    let daysBefore = 0;

    do{
      let dateBefore = new Date(date.getTime() - (daysBefore* 24* 60* 60* 1000))
      let addDate = this.dateFormat(dateBefore);

      this.dateToDraw.push(addDate)
      
      daysBefore++;
    } while(daysBefore < this._days);

    setTimeout(() => {
      this.funReDrawGraph(true);
    }, 350)
  }
  dateFormat($date) {
    let date = new Date($date);
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  }
  spliceCitiesData(city) {
    this.funReDrawGraph(false);
    let index = this._citiesToSend.findIndex((item) => {
      return city == item.label
    });

    index >= 0 && 
          this.spliceCity(index)
    
    setTimeout(() => {
      this.funReDrawGraph(true);
    })
  }
  spliceCity($index) {
    this._citiesToSend.splice($index, 1)
    this._citiesToShow.splice($index, 1)
  }
  sendCitiesToGraph(cities) {
    this._citiesToSend = cities
  }
  funReDrawGraph(value) {
    this.reDrawGraph = value;
  }
  citySelected($city) {
    this.getWeather($city);
  }
  setScale($scale) {
    this._scale = $scale.units;
    this.clearInfo();
    this.getAllCitiesWeatherInfo();  
  }
  setCitiesSelected($event) {
    this._citiesSelected = $event;
  }
  getAllCitiesWeatherInfo() {
    for (const citiesSelected of this._citiesSelected) {
      this.getWeather(citiesSelected.city)
    }
  }
  changeDays($value) {
    this._days = $value;
    this.clearInfo();
    this.addDateToGraph(new Date());
    this.getAllCitiesWeatherInfo();  
  }
  clearInfo() {
    this._citiesToShow.splice(0, this._citiesToShow.length);
    this._citiesToSend.splice(0, this._citiesToSend.length);
  }
}