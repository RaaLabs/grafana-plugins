import { DataQuery, DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from "@grafana/data";
import { Observable } from "rxjs";

export class ButtonDatasource extends DataSourceApi {
    constructor(instanceSettings: DataSourceInstanceSettings) {
        super(instanceSettings);
        console.log('Constructing datasource');
    }

    query(request: DataQueryRequest<DataQuery>): Promise<DataQueryResponse> | Observable<DataQueryResponse> {
        throw new Error("Method not implemented.");
    }

    async testDatasource(): Promise<any> {
        console.log('Testing datasource');
        return true;
    }
}
