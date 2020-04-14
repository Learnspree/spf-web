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
  initMin: string;
  initMax: string;
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
    "java11": "Java 11",
    "dotnet21": ".NET Core 2.1",
    "python36": "Python 3.6",
    "python38": "Python 3.8",
    "node810": "Node 8.10",
    "nodejs10x": "NodeJS 10.x",
    "nodejs12x": "NodeJS 12.x",
    "go": "Golang 1.x",
    "ruby25": "Ruby 2.5",
    "ruby27": "Ruby 2.7",
    "dotnet31csx": ".NET Core 3.1"
  };

  title = 'Serverless Performance Framework';

  // filter selects
  availableFunctionStates = FunctionState;

  // filter dates
  minDate = new Date(2020, 0, 13); // official prod records started 12th Jan 2020
  maxDate = new Date();
  thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate()-30));
  actualStartDate = (this.minDate > this.thirtyDaysAgo) ? this.minDate : this.thirtyDaysAgo;
  initialStartDate = new FormControl(this.actualStartDate);
  initialEndDate = new FormControl(new Date());
  selectedStartDate = new Date(this.actualStartDate);
  selectedEndDate = new Date(new Date());
  coldStartIncludesInitDurationStartDate = new Date(2020, 2, 5); // started storing init-duration for cold start on 5th March 2020

  selectedMemory = '128';
  selectedRegion = 'us-east-1';
  selectedPlatform = 'AWS Lambda';
  selectedState : FunctionState = FunctionState.warm;

  invalidInputs = false;
  errorMessage = "";

  constructor(private spfapiservice: SpfapiService) {  
    this.showAWSData()
  }

  @ViewChild('spfSort', {static: true}) spfSort: MatSort;

  updateServerlessPlatformSelection() {
    // select first option in dropdowns that have different contents depending on platform
    this.selectedMemory = '128';
    this.selectedRegion = (this.selectedPlatform == 'AWS Lambda') ? 'us-east-1' : 'east-us';
    this.refreshMetricsData();
  }

  refreshMetricsData() {
    // clear table
    this.metricsData = [];
    this.dataSource = new MatTableDataSource(this.metricsData);
    this.errorMessage = "";

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
          // we got valid data
          this.metricsData.push({
            runtime: this.displayRuntimeMap[runtime], 
            max: parseFloat(this.getExecutionDuration(data.maxExecution)).toFixed(2), 
            min: parseFloat(this.getExecutionDuration(data.minExecution)).toFixed(2), 
            mean: parseFloat(data.meanDuration).toFixed(2),
            count: data.count,
            costPerMillion: `$${parseFloat(`${data.costPerMillion}`).toFixed(2)}`,
            initMin: parseFloat(data.minExecution.InitDuration).toFixed(2),
            initMax: parseFloat(data.maxExecution.InitDuration).toFixed(2)
          });
          this.dataSource = new MatTableDataSource(this.metricsData);
          this.dataSource.sort = this.spfSort;
        }
        else {
          // an error occurred - report error to screen
          if (this.errorMessage == "") {
            this.errorMessage = `Failed to retrieve data for the following runtimes (please try again later): ${this.displayRuntimeMap[runtime]}`;
          }
          else {
            this.errorMessage += `, ${this.displayRuntimeMap[runtime]}`;
          }
        }
    });
  }  

  showAWSData() {
    let runtimes = (this.selectedPlatform == 'AWS Lambda') ? environment.aws_runtimes : environment.azure_runtimes;
    runtimes.forEach(runtime => {
      this.getSummary(runtime, this.selectedState);
    });
  }

  getExecutionDuration(executionResponseData : MinMaxResponseModel) {
    return (executionResponseData.TotalDuration === undefined) ?
        executionResponseData.Duration :
        executionResponseData.TotalDuration; 
  }

} 
