import React, { useCallback, useMemo } from "react";
import { PanelProps } from "@grafana/data";
import { getDataSourceSrv, getAppEvents, getTemplateSrv } from '@grafana/runtime';
import { Button, ButtonVariant } from "@grafana/ui";
import { ButtonDatasource } from "../datasource/datasource";

export type ButtonPanelOptions = {
    content: string;
    variant: ButtonVariant;
    dataSourceId?: string;
    endpoint?: string;
};

export type ButtonPanelProps = PanelProps<ButtonPanelOptions>;

export const ButtonPanel = (props: ButtonPanelProps) => {
    const dataSourceSrv = getDataSourceSrv();
    const templateSrv = getTemplateSrv();
    const appEvents = getAppEvents();

    const onClick = useCallback(() => {
        const settings = dataSourceSrv.getInstanceSettings(props.options.dataSourceId);

        if (settings === undefined) {
            appEvents.publish({ type: 'alert-error', payload: ['NO CONFIG', 'TODO: Write description here']});
            return;
        }

        const datasource = new ButtonDatasource(settings);
        datasource.postResource('call', { endpoint: props.options.endpoint });
        // TODO: Handle promise result
    }, [dataSourceSrv, appEvents, props.options.dataSourceId, props.options.endpoint]);

    const content = useMemo(() => 
        templateSrv.replace(props.options.content)
    , [templateSrv, props.options.content]);

    return (
        <Button
            onClick={onClick}
            variant={props.options.variant}
            type='button'
        >{content}</Button>
    );
};
