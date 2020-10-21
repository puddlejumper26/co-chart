import { GlobalDataSummary } from './../../models/global-data';
import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../services/data-service.service';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;

  dataTable = [];
  globalData: GlobalDataSummary[];

  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  };

  constructor(private dataService: DataServiceService) { }

  initiateChart(caseType: string){
    console.log(1111111, 'initiatechart');

    this.dataTable = [];

    // table x and y axis unit
    this.dataTable.push(['Country', 'Cases']);

    this.globalData.forEach(cs => {

      let value: number;

      if(caseType == 'c') {
        if( cs.confirmed > 10000 )
          { value = cs.confirmed; }
      }
      if(caseType == 'a') {
        if( cs.active > 10000 )
          { value = cs.active; }
      }
      if(caseType == 'd') {
        if( cs.deaths > 10000)
          { value = cs.deaths; }
      }
      if( caseType == 'r') {
        if( cs.recovered > 10000)
          { value = cs.recovered; }
      }

      this.dataTable.push([
        cs.country, value
      ]);
    })

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: this.dataTable,
      options:{height: 800},
    }

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: this.dataTable,
      options:{height: 800},
    }
  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next: (result)=>{
          // console.log(result);
          this.globalData = result;

          result.forEach(cs=>{
            if(!Number.isNaN(cs.confirmed)){
              this.totalActive += cs.active;
              this.totalConfirmed += cs.confirmed;
              this.totalDeaths += cs.deaths;
              this.totalRecovered += cs.recovered;
            }
          })

          this.initiateChart('r');
        },
      }
    )
  }

  updateChart(input: HTMLInputElement){
    // console.log(input.value);
    this.initiateChart(input.value);
  }
}
