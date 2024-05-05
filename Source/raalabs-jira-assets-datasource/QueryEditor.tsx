import React from "react";

import { QueryEditorProps } from "@grafana/data";

import { AssetsQuery, DataSource, DataSourceOptions } from "./datasource";
import { InlineField, Input } from "@grafana/ui";

type Props = QueryEditorProps<DataSource, AssetsQuery, DataSourceOptions>;

export const QueryEditor = ({ query, onChange }: Props) => {
  return (
    <InlineField label="AQL" labelWidth={10} tooltip="Jira Asset Query to execute" grow>
      <Input
        id="query-editor-query"
        onChange={e => onChange({ ...query, query: e.currentTarget.value })}
        value={query.query || ''}
        required
        placeholder="Enter a query..."
      />
    </InlineField>
  );
};
