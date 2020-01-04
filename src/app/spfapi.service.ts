import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MeanResponseModel } from './mean-response-model';
import { environment } from '../environments/environment';
import { FunctionState } from './state-enum';
import { MinMaxResponseModel } from './min-max-response-model';

@Injectable({
  providedIn: 'root'
})
export class SpfapiService {

  constructor(private http: HttpClient) { }

  // NOTE - region query param commented out (and zone not used either) until we start saving that in the metrics data

  getMean(platform: string, runtime: string, state: FunctionState, memory: string, region: string) {
    let getMeanUrl = `${environment.baseUrl}/${environment.envName}/runtimes/${runtime}/mean?platform=${platform}&state=${state}&memory=${memory}`; // &region=${region}`;
    return this.http.get<MeanResponseModel>(getMeanUrl);
  }

  getMax(platform: string, runtime: string, state: FunctionState, memory: string, region: string) {
    let url = `${environment.baseUrl}/${environment.envName}/runtimes/${runtime}/maximum?platform=${platform}&state=${state}&memory=${memory}`; // &region=${region}`;
    return this.http.get<MinMaxResponseModel>(url);
  }

  getMin(platform: string, runtime: string, state: FunctionState, memory: string, region: string) {
    let url = `${environment.baseUrl}/${environment.envName}/runtimes/${runtime}/minimum?platform=${platform}&state=${state}&memory=${memory}`; // &region=${region}`;
    return this.http.get<MinMaxResponseModel>(url);
  }
}
