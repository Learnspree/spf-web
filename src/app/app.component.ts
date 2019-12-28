import { Component } from '@angular/core';
import { SpfapiService } from './spfapi.service';
import { MeanResponseModel } from './mean-response-model';

// Data Table
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
// End Data Table

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Serverless Performance Framework';
  spfJava8AWSMean : MeanResponseModel = {meanDuration: '-1.0', meanBilledDuration: '-1.0'};
  spfDotNet21AWSMean : MeanResponseModel  = {meanDuration: '-1.0', meanBilledDuration: '-1.0'};

  // Data Table
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
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
