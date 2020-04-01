import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MeanResponseModel } from './mean-response-model';
import { environment } from '../environments/environment';
import { FunctionState } from './state-enum';
import { MinMaxResponseModel } from './min-max-response-model';
import { SummaryResponseModel } from './summary-response-model';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators'

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

  getSummary(platform: string, runtime: string, state: FunctionState, memory: string, region: string, startDate: Date, endDate: Date) {
    let getSummaryUrl = `${environment.baseUrl}/${environment.envName}/runtimes/${runtime}/summary?platform=${platform}&state=${state}&memory=${memory}&startdate=${this.getTimestampForDate(startDate, TimestampMarker.DayStart)}&enddate=${this.getTimestampForDate(endDate, TimestampMarker.DayEnd)}`; // &region=${region}`;
    return this.http.get<SummaryResponseModel>(getSummaryUrl)
        .pipe(
          catchError(this.handleError)
        );
  }

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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    //return throwError(
    //  'An error occurred retrieving some runtime data. Try again later.');
    return of(new HttpResponse({ body: {} }));
  };
}
