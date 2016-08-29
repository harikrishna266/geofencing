import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ionicBootstrap, Platform } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { BackgroundGeolocation } from 'ionic-native';
import { MediaPlugin } from 'ionic-native';

declare const backgroundGeolocation: any;

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
	public watcheddata:any ;
	public longitude: number;
	public latitude: number;
    public centerLat: number;
    public centerLong: number;
    public counter: number = 0;
    public distance: number = 0;
    public raduis:number;
    public entered:boolean = false;
    public file:any;
  constructor(public navCtrl: NavController,private platform: Platform) {

  }
  
    calculateDistance(lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - this.centerLat) * p)/2 + 
              c(this.centerLat * p) * c(lat2 * p) * 
              (1 - c((lon2 - this.centerLong) * p))/2;

        return 12742 * Math.asin(Math.sqrt(a))*100; // 2 * R; R = 6371 km
    }
    getCenter() {
        Geolocation.getCurrentPosition().then((resp) => {
            this.centerLat = resp.coords.latitude;
            this.centerLong = resp.coords.longitude;
        })
    }
    watchfence() {
        var backgroundOptions = {
            desiredAccuracy: 0,
            stationaryRadius: 1,
            distanceFilter: 1,
            interval: 1000,
            fastestInterval:1000,
            activitiesInterval:1000,
            debug: true
        };
         
        backgroundGeolocation.configure((location)=>{
            this.counter++;
            this.latitude = location.latitude;
            this.longitude = location.longitude;
            this.distance = this.calculateDistance(this.latitude,this.longitude);
            if((this.distance > this.raduis) && this.entered == false)
                this.playaudion();
            if((this.distance < this.raduis) && this.entered == true)
                this.stopPlay();        

        },()=>{},backgroundOptions);  
        backgroundGeolocation.start();
    }

    playaudion() {
            this.file = new MediaPlugin('/android_asset/www/mp3/mp3.mp3');
            this.file.play();
            this.entered = true;
    }
    stopPlay() {
        this.file.stop();
        this.entered = false;
    }

    clearAll() {
        backgroundGeolocation.deleteAllLocations();
    }
  



}
