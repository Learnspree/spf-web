import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MeanResponseModel } from './mean-response-model';
import { environment } from '../environments/environment';
import { FunctionState } from './state-enum';

@Injectable({
  providedIn: 'root'
})
export class SpfapiService {

  constructor(private http: HttpClient) { }

  getMean(platform: string, runtime: string, state: FunctionState) {
    let getMeanUrl = `${environment.baseUrl}/${environment.envName}/runtimes/${runtime}/mean?platform=${platform}&state=${state}`;
    return this.http.get<MeanResponseModel>(getMeanUrl);
  }
}
