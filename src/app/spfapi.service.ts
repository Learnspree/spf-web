import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MeanResponseModel } from './mean-response-model';

@Injectable({
  providedIn: 'root'
})
export class SpfapiService {

  constructor(private http: HttpClient) { }

  getMeanUrl = 'https://api.serverlessperformance.net/dev/runtimes/java8/mean';

  getMeanGoLangAWS() {
    return this.http.get<MeanResponseModel>(this.getMeanUrl);
  }
}
