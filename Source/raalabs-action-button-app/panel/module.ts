import { DataSourceInstanceSettings, PanelPlugin, SelectableValue } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Config } from '../datasource/config';

import { ButtonPanel } from './ButtonPanel';

const listButtonDatasources = (): DataSourceInstanceSettings<Config>[] =>
    getDataSourceSrv().getList({ all: true, pluginId: 'raalabs-action-button-datasource' });

const getButtonDatasourceEndpoints = (id: string) =>
    listButtonDatasources().filter(_ => _.uid === id).map(_ => _.jsonData.endpoints).at(0);

export const plugin = new PanelPlugin(ButtonPanel)
    .setPanelOptions(_ => _
        .addTextInput({
            path: 'content',
            name: 'Content',
            description: 'The text to show in the Button',
            settings: {
                expandTemplateVars: true,
            },
        })
        .addSelect({
            path: 'variant',
            name: 'Variant',
            description: 'Sets the color of the Button',
            defaultValue: 'primary',
            settings: {
                options: [
                    {
                        value: 'primary',
                        label: 'Primary',
                    },
                    {
                        value: 'secondary',
                        label: 'Secondary',
                    },
                    {
                        value: 'success',
                        label: 'Success',
                    },
                    {
                        value: 'desctructive',
                        label: 'Desctructive',
                    },
                ],
                isClearable: false,
            },
        })
        .addSelect({
            path: 'dataSourceId',
            name: 'Data Source',
            description: 'Sets the Button Data Source to use to call APIs',
            settings: {
                options: [],
                getOptions: () => Promise.resolve<Array<SelectableValue<string>>>(
                    listButtonDatasources().map(datasource => ({
                        value: datasource.uid,
                        label: datasource.name,
                    }))
                ),
            },
        })
        .addSelect({
            path: 'endpoint',
            name: 'Endpoint',
            description: 'Sets the Endpoint of the Data Source to use to call APIs',
            showIf: (options) => !!options.dataSourceId,
            settings: {
                options: [],
                getOptions: ({ options }) => Promise.resolve<Array<SelectableValue<string>>>(
                    (getButtonDatasourceEndpoints(options.dataSourceId) ?? []).map(endpoint => ({
                        value: endpoint.id,
                        label: endpoint.name ?? '-- Unnamed --',
                        description: endpoint.url ?? 'http://localhost:3000',
                    }))
                ),
            }
        })
    );
