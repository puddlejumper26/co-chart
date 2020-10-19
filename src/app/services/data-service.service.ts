import { GlobalDataSummary } from './../models/global-data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/10-18-2020.csv`;

  constructor( private http: HttpClient) { }

  getGlobalData(){
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
      map(result => {

        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');

// to remove the first element inthe array, by default would be
// 0: {country: "Country_Region", confirmed: "Confirmed", deaths: "Deaths", recovered: "Recovered", active: "
// after removce
// 0: {country: "Afghanistan", confirmed: "40200", deaths: "1492", recovered: "33614", active: "5094"}
        rows.splice(0,1);

        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          // console.log(cols);

// This is to merge all the data inside one country into one data, before would be
// 9: {country: "Australia", confirmed: "20", deaths: "20", recovered: "20", active: "20"}
// 10: {country: "Australia", confirmed: "30", deaths: "30", recovered: "30", active: "30"}
// 11: {country: "Australia", confirmed: "40", deaths: "40", recovered: "40", active: "40"}
// after would be only one element.
// 9: {country: "Australia", confirmed: "90", deaths: "90", recovered: "90", active: "90"}
          // console.log(11111, cols[7]);
          // console.log(22222, typeof(cols[7])); string
          // console.log(33333, (+cols[7]));
          // console.log(4444, typeof(+cols[7])); number

          let cs = {
            country : cols[3],
            confirmed : +cols[7], // add + to transform STRING into NUMBER
            deaths : +cols[8],
            recovered : +cols[9],
            active : +cols[10],
          };
          let temp: GlobalDataSummary = raw[cs.country];

          if(temp){
            // console.log(1111, temp);
            // console.log(2222, typeof(temp)); //object
            // console.log(3333, temp.confirmed);
            // console.log(4444, typeof(temp.confirmed)); //number
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            temp.active = cs.active + temp.active;
            raw[cs.country] = temp;
          }else{
            raw[cs.country] = cs;
          }
        })
        // console.log(raw);
        // console.log(1111, Object.values(raw));
        // console.log(2222, typeof(Object.values(raw)));
        // console.log(3333, <GlobalDataSummary[]>Object.values(raw));
        // console.log(4444,typeof(<GlobalDataSummary[]>Object.values(raw)));

        return <GlobalDataSummary[]>Object.values(raw);
      })
    )
  }
}
