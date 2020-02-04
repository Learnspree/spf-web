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
import { SummaryResponseModel } from './summary-response-model';

// Data Table
export interface MetricsData {
  runtime: string;
  mean: string;
  max: string;
  min: string;
  count: Number;
  costPerMillion: string;
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
  displayedColumns: string[] = ['runtime', 'mean', 'max', 'min', 'costPerMillion'];
  displayRuntimeMap = {
    "java8": "Java 8",
    "dotnet21": ".NET Core 2.1",
    "python36": "Python 3.6",
    "node810": "Node 8.10",
    "nodejs12x": "NodeJS 12.x",
    "go": "Golang 1.x"
  };

  title = 'Serverless Performance Framework';

  // filter selects
  availableFunctionStates = FunctionState;
  minDate = new Date(2020, 0, 13); // official prod records started 12th Jan 2020
  maxDate = new Date();
  initialStartDate = new FormControl(new Date());
  initialEndDate = new FormControl(new Date());

  
  selectedMemory = '128';
  selectedRegion = 'us-east-1';
  selectedPlatform = 'AWS Lambda';
  selectedState : FunctionState = FunctionState.warm;
  selectedStartDate = new Date(this.minDate);
  selectedEndDate = new Date(this.maxDate);

  invalidInputs = false;

  constructor(private spfapiservice: SpfapiService) {
    let thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate()-30));
    let actualStartDate = (this.minDate > thirtyDaysAgo) ? this.minDate : thirtyDaysAgo;
    this.initialStartDate = new FormControl(actualStartDate);
    this.initialEndDate = new FormControl(new Date());
  
    this.showAWSData()
  }

  @ViewChild('spfSort', {static: true}) spfSort: MatSort;

  refreshMetricsData() {
    // clear table
    this.metricsData = [];
    this.dataSource = new MatTableDataSource(this.metricsData);

    // request fresh data
    this.showAWSData();
  }

  changeStartDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value <= this.selectedEndDate) {
      this.invalidInputs = false;
      this.selectedStartDate = event.value;

      this.refreshMetricsData();
    }
    else {
      this.invalidInputs = true;
    }
  }

  changeEndDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value >= this.selectedStartDate) {
      this.invalidInputs = false;
      this.selectedEndDate = event.value;

      this.refreshMetricsData();
    }
    else {
      this.invalidInputs = true;
    }
  }

  getSummary(runtime: string, state: FunctionState) {
    this.spfapiservice.getSummary(this.selectedPlatform, runtime, state, this.selectedMemory, this.selectedRegion, this.selectedStartDate, this.selectedEndDate)
      .subscribe((data: SummaryResponseModel) => { 
        if (data.minExecution != null) {
          this.metricsData.push({
            runtime: this.displayRuntimeMap[runtime], 
            max: parseFloat(data.maxExecution.Duration).toFixed(2), 
            min: parseFloat(data.minExecution.Duration).toFixed(2), 
            mean: parseFloat(data.meanDuration).toFixed(2),
            count: data.count,
            costPerMillion: `$${parseFloat(`${data.costPerMillion}`).toFixed(2)}`
          });
          this.dataSource = new MatTableDataSource(this.metricsData);
          this.dataSource.sort = this.spfSort;
        }
    });
  }  

  showAWSData() {
    environment.runtimes.forEach(runtime => {
      this.getSummary(runtime, this.selectedState);
    });
  }

} 
