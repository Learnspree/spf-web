import { Component, OnInit, ViewChild } from '@angular/core';
import { SpfapiService } from './spfapi.service';
import { MeanResponseModel } from './mean-response-model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../environments/environment';
import { FunctionState } from './state-enum';

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
  metricsDataWarm: MetricsData[] = [];
  metricsDataCold: MetricsData[] = [];
  dataSourceWarm = new MatTableDataSource(this.metricsDataWarm);
  dataSourceCold = new MatTableDataSource(this.metricsDataCold);
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

  @ViewChild('warmSort', {static: true}) warmSort: MatSort;
  @ViewChild('coldSort', {static: true}) coldSort: MatSort;

  ngOnInit() { }

  showMeanAWS() {
    let platform = "AWS Lambda";

    // warm-start average
    environment.runtimes.forEach(runtime => {
      this.spfapiservice.getMean(platform, runtime, FunctionState.warm)
        .subscribe((data: MeanResponseModel) => { 
          this.metricsDataWarm.push({runtime: this.displayRuntimeMap[runtime], state: `${FunctionState.warm}`, mean: parseFloat(data.meanDuration).toFixed(2)});
          this.dataSourceWarm = new MatTableDataSource(this.metricsDataWarm);
          this.dataSourceWarm.sort = this.warmSort;
      });
    });

    // cold-start average
    environment.runtimes.forEach(runtime => {
      this.spfapiservice.getMean(platform, runtime, FunctionState.cold)
        .subscribe((data: MeanResponseModel) => { 
          this.metricsDataCold.push({runtime: this.displayRuntimeMap[runtime], state: `${FunctionState.cold}`, mean: parseFloat(data.meanDuration).toFixed(2)});
          this.dataSourceCold = new MatTableDataSource(this.metricsDataCold);
          this.dataSourceCold.sort = this.coldSort;
      });
    });
  }

} 
