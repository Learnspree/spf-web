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
  spfGoAWSMean : MeanResponseModel;

  constructor(private spfapiservice: SpfapiService) { 
    this.showGoMeanAWS()
  }

  showGoMeanAWS() {
    this.spfapiservice.getMeanGoLangAWS()
      .subscribe((data: MeanResponseModel) => this.spfGoAWSMean = { ...data });
  }
}
