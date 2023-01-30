import { DataQuery, DataSourceInstanceSettings } from "@grafana/data";
import { DataSourceWithBackend } from "@grafana/runtime";
import { Config } from "./config";

export class ButtonDatasource extends DataSourceWithBackend<DataQuery, Config> {
    constructor(instanceSettings: DataSourceInstanceSettings) {
        super(instanceSettings);
    }
}
