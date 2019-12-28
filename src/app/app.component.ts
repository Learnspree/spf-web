import { Component, OnInit, ViewChild } from '@angular/core';
import { SpfapiService } from './spfapi.service';
import { MeanResponseModel } from './mean-response-model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Data Table
export interface PeriodicElement {
  runtime: string;
  position: number;
  state: number;
  mean: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, runtime: 'Hydrogen', state: 1.0079, mean: 'H'},
  {position: 2, runtime: 'Helium', state: 4.0026, mean: 'He'},
  {position: 3, runtime: 'Lithium', state: 6.941, mean: 'Li'},
  {position: 4, runtime: 'Beryllium', state: 9.0122, mean: 'Be'},
];
// End Data Table

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Serverless Performance Framework';
  spfJava8AWSMean : MeanResponseModel = {meanDuration: '-1.0', meanBilledDuration: '-1.0'};
  spfDotNet21AWSMean : MeanResponseModel  = {meanDuration: '-1.0', meanBilledDuration: '-1.0'};

  // Data Table
  @ViewChild(MatSort, {static: true}) sort: MatSort;
    
  displayedColumns: string[] = ['position', 'runtime', 'state', 'mean'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }
  // End Data Table

  constructor(private spfapiservice: SpfapiService) { 
    this.showMeanAWS()
  }

  showMeanAWS() {
    let platform = "AWS Lambda";

    // Java 8
    this.spfapiservice.getMean(platform, "java8")
      .subscribe((data: MeanResponseModel) => this.spfJava8AWSMean = { ...data });

    // .NET 2.1
    this.spfapiservice.getMean(platform, "dotnet21")
    .subscribe((data: MeanResponseModel) => this.spfDotNet21AWSMean = { ...data });

  }
}
