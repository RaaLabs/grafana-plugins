import { DataSourcePlugin } from '@grafana/data';
import { ButtonDatasource } from './datasource';

console.log('DataSource is loading');

export const plugin = new DataSourcePlugin(ButtonDatasource);
