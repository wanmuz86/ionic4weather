import { Component , OnInit} from '@angular/core';
import { HttpService } from '../http.service';
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	weathers = []
	city : string =""
	isLoading = false;
	constructor(public httpService:HttpService,
		public geolocation:Geolocation) {}

	ngOnInit(){
		console.log("getting location")
		let options = {
			timeout: 30000,
			enableHighAccuracy: true
		}
		this.isLoading = true;
		this.geolocation.getCurrentPosition(options).then((resp) => {
			console.log("get location")
			console.log(resp.coords.latitude)
			console.log(resp.coords.longitude)
			this.httpService.getWeatherByGeo(resp.coords.latitude,
				resp.coords.longitude)
			.subscribe(resp=>{
				this.isLoading = false
				console.log(resp)
				this.city = resp["city"]["name"]
				this.weathers = resp["list"]
			},err=>{
				console.log(err)
				this.isLoading = false
			})

		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	retrieveWeather(){
		console.log(this.city)
		this.isLoading = true;
		this.httpService.getWeather(this.city).subscribe(resp=>{
			
			this.weathers = resp["list"];
			this.isLoading = false
		},err=>{
			console.log(err);
			this.isLoading = false
		})
	}

}
