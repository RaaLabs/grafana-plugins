import { DataSourcePlugin } from '@grafana/data';

import { ConfigEditor } from './ConfigEditor';
import { ButtonDatasource } from './datasource';

export const plugin = new DataSourcePlugin(ButtonDatasource)
    .setConfigEditor(ConfigEditor);
