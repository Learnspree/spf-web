import { Component, OnInit, ViewChild } from '@angular/core';
import { SpfapiService } from './spfapi.service';
import { MeanResponseModel } from './mean-response-model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../environments/environment';

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
  dataSource = new MatTableDataSource(this.metricsData);
  displayedColumns: string[] = ['position', 'runtime', 'state', 'mean'];
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
          this.metricsData.push({position: this.metricsData.length + 1, runtime: runtime, state: 'Warm/Cold', mean: data.meanDuration});
          this.dataSource = new MatTableDataSource(this.metricsData);
          this.dataSource.sort = this.sort;
      });
    });
  }
  
}
