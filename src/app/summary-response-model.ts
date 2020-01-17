import { MinMaxResponseModel } from './min-max-response-model';

export interface SummaryResponseModel {
    meanDuration: string;
    meanBilledDuration: string;
    maxExecution: MinMaxResponseModel;
    minExecution: MinMaxResponseModel;
    count: Number;
}
