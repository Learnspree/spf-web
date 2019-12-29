import { Component, OnInit, ViewChild } from '@angular/core';
import { SpfapiService } from './spfapi.service';
import { MeanResponseModel } from './mean-response-model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../environments/environment';

// Data Table
export interface MetricsData {
  runtime: string;
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
  dataSource = new MatTableDataSource(this.metricsData);
  displayedColumns: string[] = ['runtime', 'state', 'mean'];
  displayRuntimeMap = {
    "java8": "Java 8",
    "dotnet21": ".NET Core 2.1",
    "python36": "Python 3.6",
    "node810": "Node 8.10",
    "go": "Golang 1.x"
  };

  title = 'Serverless Performance Framework';

  constructor(private spfapiservice: SpfapiService) { 
    this.showMeanAWS()
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() { }

  showMeanAWS() {
    let platform = "AWS Lambda";
    environment.runtimes.forEach(runtime => {
      this.spfapiservice.getMean(platform, runtime)
        .subscribe((data: MeanResponseModel) => { 
          this.metricsData.push({runtime: this.displayRuntimeMap[runtime], state: 'Warm/Cold', mean: parseFloat(data.meanDuration).toFixed(2)});
          this.dataSource = new MatTableDataSource(this.metricsData);
          this.dataSource.sort = this.sort;
      });
    });
  }

} 
