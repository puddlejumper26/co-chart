import { DateWiseData } from './../../models/date-wise-data';
import { GlobalDataSummary } from './../../models/global-data';
import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
// import { GoogleChartInterface } from 'ng2-google-charts';
import { map } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[];
  countries: string[] = [];

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  dateWiseData;
  dataTable = [];
  selectedCountryData: DateWiseData[];
  chart = {
    LineChart : "LineChart",
    height: 500,
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }
  }
  loading = true;


  constructor( private service: DataServiceService) { }

  ngOnInit(): void {

    // this.service.getDateWiseData().subscribe(
    //   // result => console.log(result)
    //   (result) => {
    //     this.dateWiseData = result;
    //     this.updateChart();
    //   }
    // )

    merge(
      this.service.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(map(result=>{
        this.data = result;
        this.data.forEach(cs=>{
          this.countries.push(cs.country)
        })
      }))
    ).subscribe(
      {
        complete : ()=>{
         this.updateValues('India')
         this.loading = false;
        }
      }
    )

    // this.service.getGlobalData().subscribe( result => {
    //   this.data = result;
    //   this.data.forEach( cs => {
    //     this.countries.push(cs.country);
    //   })
    // })
  }

  updateChart(){
    // this.dataTable.push(["Date" , 'Cases'])
    this.selectedCountryData.forEach(cs=>{
      this.dataTable.push([cs.date , cs.cases])
    })

// https://www.devrandom.it/software/ng2-google-charts/additional-documentation/usage.html
    // this.lineChart = {
    //   chartType: 'LineChart',
    //   dataTable: dataTable,
    //   //firstRowIsData: true,
    //   options: { height: 500 },
    // };
  }

  updateValues(country: string){
    // console.log(country);
    this.data.forEach(cs=>{
      if(cs.country == country){
        this.totalActive = +cs.active;
        this.totalConfirmed = +cs.confirmed;
        this.totalDeaths = +cs.deaths;
        this.totalRecovered = +cs.recovered;
      }
    })

    this.selectedCountryData = this.dateWiseData[country];
    // console.log(this.selectedCountryData);
    this.updateChart();
  }
}
