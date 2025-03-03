import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-country',
  imports: [
    NgxChartsModule
  ],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit, OnDestroy{
  //variable declarations
  countryName: string = '';
  countryData: any[] = [];
  colorScheme: Color | any;
  totalParticipations: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router:Router){}
  

  


  //3rd try
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.colorScheme = {
      domain: ['#5aa454', '#A10A28', '#C7B42C', '#AAAAAA', '#FF5733']
    };

    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('countryName') || 'Unknown Country';
      console.log('🌍 Country Name from URL', this.countryName)
      
      this.olympicService.getCountryByName(this.countryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (country) => {
          if(!country || !country.participations || country.participations.length === 0){
            if(this.router.url !== '/error'){
              this.router.navigate(['/error']);
            }
            return;
          }

          this.countryData = [{
          name: this.countryName,
          series: country.participations.map(p => ({
            name: p.year.toString(),
            value: p.medalsCount ?? 0
          }))
        }];
        this.totalParticipations = country.participations.length;
        this.totalMedals = country.participations.reduce((sum,p) => sum + (p.medalsCount ?? 0),0);
        this.totalAthletes = country.participations.reduce((sum, p) => sum + (p.athleteCount ?? 0),0);
      },
      error: () => {
        this.router.navigate(['/error']);
      }
    });
  }); //penser à l'unsubscribe
  
}
ngOnDestroy(): void {
  this.destroy$.next(); // notifie que le composant est détruit
  this.destroy$.complete(); // termine le subject
  
}
}
    

