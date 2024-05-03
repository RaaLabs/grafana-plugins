import React from "react";

import { QueryEditorProps } from "@grafana/data";

import { AssetsQuery, DataSource, DataSourceOptions } from "./datasource";

type Props = QueryEditorProps<DataSource, AssetsQuery, DataSourceOptions>;

export const QueryEditor = (props: Props) => {
  return (
    <div>
      <h1>Query Editor</h1>
    </div>
  );
};
