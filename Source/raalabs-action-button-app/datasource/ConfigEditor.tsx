import React, { FormEventHandler, useCallback } from "react";
import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { Button, InlineField, Input } from "@grafana/ui";

import { Config, EndpointConfig } from "./config";

export type ConfigEditorProps = DataSourcePluginOptionsEditorProps<Config>;

export const ConfigEditor = (props: ConfigEditorProps) => {
    const { options, onOptionsChange } = props;

    const onClickAdd = useCallback(() => {
        onOptionsChange({
            ...options,
            jsonData: {
                ...options.jsonData,
                endpoints: (options.jsonData.endpoints ?? []).concat({
                    id: crypto.randomUUID(),
                }),
            },
        });
    }, [ options, onOptionsChange ]);

    const onEndpointOptionsChange = useCallback((id: string) =>
        (config: EndpointConfig) =>
            onOptionsChange({
                ...options,
                jsonData: {
                    ...options.jsonData,
                    endpoints: options.jsonData.endpoints?.map(endpoint =>
                        endpoint.id === id
                            ? config
                            : endpoint
                    ),
                },
            })
    , [options, onOptionsChange ]);

    const onClickEndpointRemove = useCallback((id: string) =>
        () => onOptionsChange({
            ...options,
            jsonData: {
                ...options.jsonData,
                endpoints: options.jsonData.endpoints?.filter(endpoint =>
                    endpoint.id !== id
                ),
            },
        })
    , [options, onOptionsChange]);

    return (
        <>
            <h3 className="page-heading">Endpoints</h3>
            { options.jsonData.endpoints?.map(endpoint => (
                <EndpointEditor
                    key={endpoint.id}
                    config={endpoint}
                    onEndpointConfigChange={onEndpointOptionsChange(endpoint.id)}
                    onRemoveClicked={onClickEndpointRemove(endpoint.id)}
                />
            )) }
            <div className="gf-form-group">
                <div className="gf-form">
                    <Button variant="secondary" icon="plus" type="button" onClick={onClickAdd}>Add endpoint</Button>
                </div>
            </div>
        </>
    );
};

type EndpointEditorProps = {
    config: EndpointConfig;
    onEndpointConfigChange?: (Config: EndpointConfig) => void;
    onRemoveClicked?: () => void;
};

const EndpointEditor = (props: EndpointEditorProps) => {
    const { config, onEndpointConfigChange, onRemoveClicked } = props;

    const onNameChange = useCallback<FormEventHandler<HTMLInputElement>>((event) => {
        event.preventDefault();
        onEndpointConfigChange?.({
            ...config,
            name: (event.target as HTMLInputElement).value,
        })
    }, [config, onEndpointConfigChange]);

    const onUrlChange = useCallback<FormEventHandler<HTMLInputElement>>((event) => {
        event.preventDefault();
        onEndpointConfigChange?.({
            ...config,
            url: (event.target as HTMLInputElement).value,
        })
    }, [config, onEndpointConfigChange]);

    return (
        <div className="gf-form-group">
            <div className="gf-form">
                <InlineField label="Name" labelWidth={12} tooltip="The name that will be displayed in the Button panel settings">
                    <Input placeholder="Endpoint Name" width={36} value={config.name} onChange={onNameChange} />
                </InlineField>
            </div>
            <div className="gf-form">
                <InlineField label="URL" labelWidth={12} tooltip="The base URL that will be used to perform the Button panel requests">
                    <Input placeholder="http://localhost:3000" width={36} value={config.url} onChange={onUrlChange} />
                </InlineField>
            </div>
            <div className="gf-form">
                <Button type="button" variant="destructive" size="xs" onClick={onRemoveClicked}>Remove endpoint</Button>
            </div>
        </div>
    );
};
