import { Component } from '@angular/core';
import { SpfapiService } from './spfapi.service';
import { MeanResponseModel } from './mean-response-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Serverless Performance Framework';
  spfJava8AWSMean : MeanResponseModel;
  spfDotNet21AWSMean : MeanResponseModel;

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
