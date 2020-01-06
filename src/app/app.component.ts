import { Component, OnInit, ViewChild } from '@angular/core';
import { SpfapiService } from './spfapi.service';
import { MeanResponseModel } from './mean-response-model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../environments/environment';
import { FunctionState } from './state-enum';
import { MinMaxResponseModel } from './min-max-response-model';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

// Data Table
export interface MetricsData {
  runtime: string;
  mean: string;
  max: string;
  min: string;
}
// End Data Table

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  metricsData: MetricsData[] = [];
  dataSource = new MatTableDataSource(this.metricsData);
  displayedColumns: string[] = ['runtime', 'max', 'min', 'mean'];
  displayRuntimeMap = {
    "java8": "Java 8",
    "dotnet21": ".NET Core 2.1",
    "python36": "Python 3.6",
    "node810": "Node 8.10",
    "go": "Golang 1.x"
  };

  title = 'Serverless Performance Framework';

  // filter selects
  availableFunctionStates = FunctionState;
  minDate = new Date(2019, 0, 1);
  maxDate = new Date();
  initialStartDate = new FormControl(new Date());
  initialEndDate = new FormControl(new Date());
  
  selectedMemory = '128';
  selectedRegion = 'us-east-1';
  selectedPlatform = 'AWS Lambda';
  selectedState : FunctionState = FunctionState.warm;
  selectedStartDate = new Date();
  selectedEndDate = new Date();

  constructor(private spfapiservice: SpfapiService) { 
    this.showMeanAWS()
  }

  @ViewChild('spfSort', {static: true}) spfSort: MatSort;

  refreshMetricsData() {
    // clear table
    this.metricsData = [];
    this.dataSource = new MatTableDataSource(this.metricsData);

    // request fresh data
    this.showMeanAWS();
  }

  changeStartDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value <= this.selectedEndDate) {

      this.selectedStartDate = event.value;

      // clear table
      this.metricsData = [];
      this.dataSource = new MatTableDataSource(this.metricsData);
    }
    else {
      // TODO - show error message
    }
  }

  changeEndDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value >= this.selectedStartDate) {

      this.selectedEndDate = event.value;

      // clear table
      this.metricsData = [];
      this.dataSource = new MatTableDataSource(this.metricsData);
    }
    else {
      // TODO - show error message
    }
  }

  getMin(runtime: string, state: FunctionState) {
    this.spfapiservice.getMin(this.selectedPlatform, runtime, state, this.selectedMemory, this.selectedRegion)
      .subscribe((data: MinMaxResponseModel) => { 
        // update existing metrics data with min value
        let displayRuntimeValue = this.displayRuntimeMap[runtime];
        let metricForUpdate = this.metricsData.find(function (entry) { return entry.runtime === displayRuntimeValue; });
        console.log("Min Duration for " + data.LanguageRuntime + ": " + data.Duration);
        metricForUpdate.min = data.Duration;

        // update data source
        this.dataSource = new MatTableDataSource(this.metricsData);
        this.dataSource.sort = this.spfSort;
    });
  }

  getMax(runtime: string, state: FunctionState) {
    this.spfapiservice.getMax(this.selectedPlatform, runtime, state, this.selectedMemory, this.selectedRegion)
      .subscribe((data: MinMaxResponseModel) => { 
        // update existing metrics data with min value
        let displayRuntimeValue = this.displayRuntimeMap[runtime];
        let metricForUpdate = this.metricsData.find(function (entry) { return entry.runtime === displayRuntimeValue; });
        metricForUpdate.max = parseFloat(data.Duration).toFixed(2);

        // update data source
        this.dataSource = new MatTableDataSource(this.metricsData);
        this.dataSource.sort = this.spfSort;
    });
  }  

  showMeanAWS() {

    environment.runtimes.forEach(runtime => {
      this.spfapiservice.getMean(this.selectedPlatform, runtime, this.selectedState, this.selectedMemory, this.selectedRegion)
        .subscribe((data: MeanResponseModel) => { 
          this.metricsData.push({runtime: this.displayRuntimeMap[runtime], max: "", min: "", mean: parseFloat(data.meanDuration).toFixed(2)});
          this.dataSource = new MatTableDataSource(this.metricsData);
          this.dataSource.sort = this.spfSort;

          // now get min and max
          this.getMin(runtime, this.selectedState)
          this.getMax(runtime, this.selectedState)
      });
    });
  }

} 
