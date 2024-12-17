import { DataFrame, DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings, Field, FieldType, TestDataSourceResponse, MetricFindValue } from "@grafana/data";
import { getBackendSrv, getTemplateSrv } from "@grafana/runtime";
import { DataQuery, DataSourceJsonData } from "@grafana/schema";
import { AssetObject, ObjectAttributeValue, ObjectListInclTypeAttributesEntryResult, ObjectTypeAttribute } from "./types";

export interface AssetsQuery extends DataQuery {
    query: string;
}

export interface MyVariableQuery {
    rawQuery: string;
    field: string;
}

export interface DataSourceOptions extends DataSourceJsonData {
    workspaceID?: string;
}

export interface SecureDataSourceOptions {
    basicAuthPassword?: string;
}

export class DataSource extends DataSourceApi<AssetsQuery, DataSourceOptions> {
    readonly url?: string;

    constructor(config: DataSourceInstanceSettings<DataSourceOptions>) {
        super(config);
        this.url = config.url;
    }

    async query(request: DataQueryRequest<AssetsQuery>): Promise<DataQueryResponse> {
        const response: DataQueryResponse = { data: [] };
        for (const target of request.targets) {
            const aql = getTemplateSrv().replace(target.query, request.scopedVars);
            const result = await this.assetQuery(aql);
            response.data.push({ ...result, refId: target.refId });
        }
        return response;
    }

    async testDatasource(): Promise<TestDataSourceResponse> {
        const result = await this.assetQuery('', false);
        if (result.length > 0 && result.meta?.custom?.total > 0) {
            return {
                status: 'success',
                message: `Discovered ${result.meta?.custom?.total} assets in workspace`,
            };
        } else {
            return {
                status: 'error',
                message: 'Failed to connect to Jira Assets API',
            };
        }
    }

    private async assetQuery(aql: string, all: boolean = true): Promise<DataFrame> {
        const attributes: ObjectTypeAttribute[] = [];
        const objects: AssetObject[] = [];

        let response : ObjectListInclTypeAttributesEntryResult | undefined;
        while (response === undefined || (all && !response.isLast)) {
            response = await getBackendSrv()
                .post<ObjectListInclTypeAttributesEntryResult>(
                    `${this.url}/aql?startAt=${objects.length}&maxResults=500&includeAttributes=true`,
                    { qlQuery: aql },
                );

            attributes.push(...response.objectTypeAttributes);
            objects.push(...response.values);
        }

        const fields: Field[] = [], mapped = new Set<string>();
        for (const attribute of attributes) {
            if (mapped.has(attribute.id)) continue;
            mapped.add(attribute.id);

            const field = {
                name: attribute.name,
                type: DataSource.jiraTypeToGrafanaType(attribute),
                config: {},
            };
            const values = objects.map(({ attributes }) => {
                for (const { objectTypeAttributeId, objectAttributeValues } of attributes) {
                    if (objectTypeAttributeId !== attribute.id) continue;

                    if (attribute.maximumCardinality > 1) {
                        return objectAttributeValues.map(v => DataSource.jiraValueToGrafanaValue(v, field.type));
                    }

                    if (objectAttributeValues.length > 0) {
                        return DataSource.jiraValueToGrafanaValue(objectAttributeValues[0], field.type);
                    }

                    break;
                }
                return null;
            });

            if (attribute.maximumCardinality > 1) {
                field.type = FieldType.other;
            }

            fields.push({ ...field, values });
        }

        return { fields, length: objects.length, meta: { custom: { total: response?.total }}};
    }

    private static jiraValueToGrafanaValue(value: ObjectAttributeValue, type: FieldType): any {
        switch (type) {
            case FieldType.string:
            case FieldType.other:
                return value.displayValue;
            case FieldType.number:
                return parseFloat(value.value);
            case FieldType.boolean:
                return !!value.value;
            case FieldType.time:
                return value.value;
        }
    }

    private static jiraTypeToGrafanaType(attribute: ObjectTypeAttribute): FieldType {
        switch (attribute.type) {
            case 0: // Default
                switch (attribute.defaultType.id) {
                    case 0: // Text
                    case 7: // Url
                    case 8: // Email
                    case 9: // Textarea
                    case 8: // Select
                    case 11: // IP Address
                        return FieldType.string;
                    case 1: // Integer
                    case 3: // Double
                        return FieldType.number;
                    case 2: // Boolean
                        return FieldType.boolean;
                    case 4: // Date
                    case 5: // Time
                    case 6: // DateTime
                        return FieldType.time;
                }
                return FieldType.other;
            case 1: // Object reference
            case 2: // User
            case 4: // Group
            case 7: // Status
                return FieldType.other;
        }
        return FieldType.other;
    }

    async metricFindQuery(query: MyVariableQuery, options?: any): Promise<MetricFindValue[]> {
        // Retrieve DataQueryResponse based on query.
        const aql = getTemplateSrv().replace(query.rawQuery, options.scopedVars);
        const result = await this.assetQuery(aql, false);
        const column_name = query.field;
        for (var i = 0; i < result.fields.length; i++) {
            if (result.fields[i].name == column_name) {
                break;
            }
        }
        let retVal : MetricFindValue[] = []
        if (result !== undefined && result.fields.length > 0) {
            // Return values for selected field
            for (const value of result.fields[i].values) {
                retVal.push({text: value});
            }
        }
        return retVal;
    }
}
