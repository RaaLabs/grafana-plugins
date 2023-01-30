import React from "react";
import { PanelProps } from "@grafana/data";
import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { Button } from "@grafana/ui";

export type ButtonPanelOptions = {

};

export type ButtonPanelProps = PanelProps<ButtonPanelOptions>;

export const ButtonPanel = (props: ButtonPanelProps) => (
    <Button
        onClick={async () => {
            console.log('Hello button was clicked');

            // const src = getDataSourceSrv();
            // console.log('srv', src);
            const dss1 = getDataSourceSrv().getList({ all: true, pluginId: 'raalabs-action-button-datasource' });
            // const dss2 = await getBackendSrv().get('/api/datasources');
            console.log('Data Sources', dss1);
            // console.log('Data Sources', dss2);

        }}
        variant='destructive'
        type='button'
    >Hello there</Button>
);
