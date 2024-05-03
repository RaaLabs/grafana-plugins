import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    input: {
        'module': 'module.ts',
    },
    output: {
        dir: '../../dist/raalabs-jiraassets-datasource',
        sourcemap: true,
        format: 'amd',
    },
    plugins: [
        typescript({
            sourceMap: true,
        }),
        copy({
            targets:[
                { 
                    src: 'plugin.json',
                    dest: '../../dist/raalabs-jiraassets-datasource',
                    transform: (contents) => contents.toString()
                        .replace('%TODAY%', new Date().toISOString().split('T')[0])
                        .replace('%VERSION%', '1.0.0')
                },
            ],
        }),
    ],
    external: [
        '@grafana/data',
        '@grafana/runtime',
        '@grafana/schema',
        '@grafana/ui',
        'react',
        'react-dom',
        'rxjs',
    ],
});
