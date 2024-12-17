import { DataSourcePlugin } from "@grafana/data";

import { ConfigEditor } from "./ConfigEditor";
import { QueryEditor } from "./QueryEditor";
import { VariableQueryEditor } from "./VariableQueryEditor";
import { AssetsQuery, DataSource, DataSourceOptions } from "./datasource";

export const plugin = new DataSourcePlugin<DataSource, AssetsQuery, DataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor)
  .setVariableQueryEditor(VariableQueryEditor);
