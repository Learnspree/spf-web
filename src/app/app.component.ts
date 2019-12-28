import { Component, OnInit, ViewChild } from '@angular/core';
import { SpfapiService } from './spfapi.service';
import { MeanResponseModel } from './mean-response-model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Data Table
export interface MetricsData {
  runtime: string;
  position: number;
  state: string;
  mean: string;
}
// End Data Table

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  metricsData: MetricsData[] = [];
  title = 'Serverless Performance Framework';

  // Data Table
  @ViewChild(MatSort, {static: true}) sort: MatSort;
    
  displayedColumns: string[] = ['position', 'runtime', 'state', 'mean'];
  dataSource = new MatTableDataSource(this.metricsData);

  ngOnInit() {

  }
  // End Data Table

  constructor(private spfapiservice: SpfapiService) { 
    this.showMeanAWS()
  }

  showMeanAWS() {
    let platform = "AWS Lambda";

    // Java 8
    this.spfapiservice.getMean(platform, "java8")
      .subscribe((data: MeanResponseModel) => { 
        this.metricsData.push({position: this.metricsData.length + 1, runtime: 'Java 8', state: 'Cold', mean: data.meanDuration});
        this.dataSource = new MatTableDataSource(this.metricsData);
        this.dataSource.sort = this.sort;
      });

    // .NET 2.1
    this.spfapiservice.getMean(platform, "dotnet21")
    .subscribe((data: MeanResponseModel) => { 
      this.metricsData.push({position: this.metricsData.length + 1, runtime: '.NET 2.1', state: 'Warm', mean: data.meanDuration});
      this.dataSource = new MatTableDataSource(this.metricsData);
      this.dataSource.sort = this.sort;
    });

  }
}
