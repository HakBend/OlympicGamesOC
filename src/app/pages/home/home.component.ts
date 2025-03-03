import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, partition } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';
import { Color } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
    public olympics$: Observable<Country[]> = of();
    chartData : any[] = []; //will receive all data for the chart
    public olympicsCountryCount: number = 0;
    public olympicsYearsCount: number = 0;
    olympics: Country[] = [];

    colorScheme: Color | any;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {

    this.colorScheme = {
        domain:['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#FF5733']
    }
    //this.olympics$ = this.olympicService.getOlympics(); //first try

    // this.olympics$.subscribe((countries)=> {
    //     console.log("data received:", countries);
        
    // });
    this.olympicService.getOlympics().subscribe((data) => {
      this.olympics = data; // data received stored

      //prepare data for ngx-charts
      this.chartData = this.olympics.map((country) => ({
        name: country.country,
        value: country.participations
        ? country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
        : 0,
      }))
      //table chartData will look like: 
      /*[
          { name: "France", value:45 },
          { name: "USA", value 120},
          { name: "Japan", value 35}
          ...
      ]*/

      console.log("Data Received after olympicService loading: ", this.olympics);

      this.olympics$ = this.olympicService.getOlympics();
      
      //retrieves number of country
      this.olympics$.subscribe((countries)=> {
        console.log("Data received after loading olympics$:", countries);
        this.olympicsCountryCount = countries.length;
        console.log("Numbers of countries: ", this.olympicsCountryCount)
      });
      //retrieves number of JO's
      this.olympics$.subscribe((countries)=> {
        const yearsSet = new Set<number>(); //stores unique year

        countries.forEach((country) => {
          country.participations.forEach((participation) => {
            yearsSet.add(participation.year);
          });
        });
        this.olympicsYearsCount = yearsSet.size;// number of unique year
      });
    });
  }
  
  onCountrySelect(event: any): void{
    const selectedCountry = event.name;
    console.log("Selected Country: ", selectedCountry);

    //redirect to selected country page
    this.router.navigate(['/country/'+ selectedCountry]);
  }


}
      


      

  
