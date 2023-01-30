import { DataSourceJsonData } from "@grafana/data";

export type Config = DataSourceJsonData & {
    endpoints?: EndpointConfig[];
};

export type EndpointConfig = {
    id: string;
    name?: string;
    url?: string;
};
