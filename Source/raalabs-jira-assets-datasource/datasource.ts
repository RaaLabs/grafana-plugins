import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings, TestDataSourceResponse } from "@grafana/data";
import { getBackendSrv } from "@grafana/runtime";
import { DataQuery, DataSourceJsonData } from "@grafana/schema";
import { Observable, lastValueFrom } from "rxjs";

export interface AssetsQuery extends DataQuery {
    query: string;
}

export interface DataSourceOptions extends DataSourceJsonData {
    tenant?: string;
    basicAuth?: boolean;
    basicAuthUser?: string;
}

export interface SecureDataSourceOptions {
    basicAuthPassword?: string;
}

export class DataSource extends DataSourceApi<AssetsQuery, DataSourceOptions> {
    readonly url?: string;

    constructor(config: DataSourceInstanceSettings<DataSourceOptions>) {
        super(config);
        console.log('constructor');
        this.url = config.url;
    }

    query(request: DataQueryRequest<AssetsQuery>): Promise<DataQueryResponse> | Observable<DataQueryResponse> {
        throw new Error("Method not implemented.");
    }

    async testDatasource(): Promise<TestDataSourceResponse> {
        const response = getBackendSrv().fetch({
            method: 'GET',
            url: `${this.url}/workspace`,
        });
        console.log(await lastValueFrom(response));

        return {
            status: 'success',
            message: 'Data source is working',
        };
    }

}
