import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MeanResponseModel } from './mean-response-model';
import { environment } from '../environments/environment';
import { FunctionState } from './state-enum';
import { MinMaxResponseModel } from './min-max-response-model';

enum TimestampMarker {
  DayStart = "start",
  DayEnd = "end"
}

@Injectable({
  providedIn: 'root'
})
export class SpfapiService {

  constructor(private http: HttpClient) { }

  // NOTE - region query param commented out (and zone not used either) until we start saving that in the metrics data

  getMean(platform: string, runtime: string, state: FunctionState, memory: string, region: string, startDate: Date, endDate: Date) {
    let getMeanUrl = `${environment.baseUrl}/${environment.envName}/runtimes/${runtime}/mean?platform=${platform}&state=${state}&memory=${memory}&startdate=${this.getTimestampForDate(startDate, TimestampMarker.DayStart)}&enddate=${this.getTimestampForDate(endDate, TimestampMarker.DayEnd)}`; // &region=${region}`;
    return this.http.get<MeanResponseModel>(getMeanUrl);
  }

  getMax(platform: string, runtime: string, state: FunctionState, memory: string, region: string, startDate: Date, endDate: Date) {
    let url = `${environment.baseUrl}/${environment.envName}/runtimes/${runtime}/maximum?platform=${platform}&state=${state}&memory=${memory}&startdate=${this.getTimestampForDate(startDate, TimestampMarker.DayStart)}&enddate=${this.getTimestampForDate(endDate, TimestampMarker.DayEnd)}`; // &region=${region}`;
    return this.http.get<MinMaxResponseModel>(url);
  }

  getMin(platform: string, runtime: string, state: FunctionState, memory: string, region: string, startDate: Date, endDate: Date) {
    let url = `${environment.baseUrl}/${environment.envName}/runtimes/${runtime}/minimum?platform=${platform}&state=${state}&memory=${memory}&startdate=${this.getTimestampForDate(startDate,  TimestampMarker.DayStart)}&enddate=${this.getTimestampForDate(endDate, TimestampMarker.DayEnd)}`; // &region=${region}`;
    return this.http.get<MinMaxResponseModel>(url);
  }

  private getTimestampForDate(inputDate: Date, marker: TimestampMarker) {
    if (marker == TimestampMarker.DayEnd) {
      inputDate.setHours(23,59,59,999); // midnight at start of day
    }
    else {
      inputDate.setHours(0,0,0,0); // midnight at start of day
    }
    
    let timestamp = (inputDate.getTime()).toFixed(0);
    return timestamp;
  }
}
