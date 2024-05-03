import React from "react";

import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { InlineField, Input, SecretInput } from "@grafana/ui";

import { DataSourceOptions, SecureDataSourceOptions } from "./datasource";

interface Props extends DataSourcePluginOptionsEditorProps<DataSourceOptions, SecureDataSourceOptions> {}

export const ConfigEditor = ({ onOptionsChange, options }: Props) => {
  const { jsonData, secureJsonFields, secureJsonData } = options;
  console.log('JASON', options);

  return (
    <>
      <InlineField label="Tenant" labelWidth={14} interactive tooltip={'Atlassian workspace tenant'}>
        <Input
          required
          id="config-editor-tenant"
          onChange={e => onOptionsChange({ ...options, jsonData: { ...jsonData, tenant: e.currentTarget.value } })}
          value={jsonData.tenant}
          width={40}
        />
      </InlineField>
      <InlineField label="Username" labelWidth={14} interactive tooltip={'Jira username'}>
        <Input
          required
          id="config-editor-username"
          onChange={e => onOptionsChange({ ...options, basicAuth: true, basicAuthUser: e.currentTarget.value })}
          value={jsonData.basicAuthUser}
          width={40}
        />
      </InlineField>
      <InlineField label="API Token" labelWidth={14} interactive tooltip={'Jira API token'}>
        <SecretInput
          required
          id="config-editor-api-key"
          isConfigured={secureJsonFields.basicAuthPassword}
          value={secureJsonData?.basicAuthPassword}
          width={40}
          onChange={e => onOptionsChange({ ...options, secureJsonData: { basicAuthPassword: e.currentTarget.value } })}
          onReset={() => onOptionsChange({ ...options, secureJsonFields: { ...secureJsonFields, basicAuthPassword: false }})}
        />
      </InlineField>
    </>
  );
};
