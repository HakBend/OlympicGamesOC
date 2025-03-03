import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map,tap } from 'rxjs/operators';
import { Country} from 'src/app/core/models/Olympic';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  // private olympicUrl = './assets/mock/olympic.json';
  private olympicUrl = '/assets/mock/olympic.json';

  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics(): Observable<Country[]>{
      //better option
      return this.http.get<Country[]>(this.olympicUrl);

    //first try
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap(data => console.log("Service's Data: ", data))
    );
  }

  getCountryByName(name: string): Observable<Country> {
    return this.getOlympics().pipe(
      map(countries => {
        const country =  countries.find(c => c.country === name);
        if(!country){
          throw new Error('Pays "$(name)" non trouvé');
        }
        return country;
      }),
      catchError(err=>throwError(() => new Error('Pays non trouvé')))
    );
  }
    
    
}
