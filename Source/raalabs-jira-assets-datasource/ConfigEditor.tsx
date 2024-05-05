import React from "react";

import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { InlineField, Input, SecretInput } from "@grafana/ui";

import { DataSourceOptions, SecureDataSourceOptions } from "./datasource";

interface Props extends DataSourcePluginOptionsEditorProps<DataSourceOptions, SecureDataSourceOptions> { }

export const ConfigEditor = ({ onOptionsChange, options }: Props) => {
  const { jsonData, secureJsonFields, secureJsonData } = options;
  return (
    <>
      <InlineField label="Username" labelWidth={16} interactive tooltip={'Jira username'}>
        <Input
          required
          id="config-editor-username"
          onChange={e => onOptionsChange({ ...options, basicAuth: true, basicAuthUser: e.currentTarget.value })}
          value={options.basicAuthUser}
          width={40}
        />
      </InlineField>
      <InlineField label="API Token" labelWidth={16} interactive tooltip={'Jira API token'}>
        <SecretInput
          required
          id="config-editor-api-key"
          isConfigured={secureJsonFields.basicAuthPassword}
          value={secureJsonData?.basicAuthPassword}
          width={40}
          onChange={e => onOptionsChange({ ...options, secureJsonData: { basicAuthPassword: e.currentTarget.value } })}
          onReset={() => onOptionsChange({ ...options, secureJsonFields: { ...secureJsonFields, basicAuthPassword: false } })}
        />
      </InlineField>
      <InlineField label="Workspace ID" labelWidth={16} interactive tooltip={'Atlassian workspace ID'}>
        <Input
          required
          id="config-editor-workspace-id"
          onChange={e => onOptionsChange({ ...options, jsonData: { ...jsonData, workspaceID: e.currentTarget.value } })}
          value={jsonData.workspaceID}
          width={40}
        />
      </InlineField>
    </>
  );
};
