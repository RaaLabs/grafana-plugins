import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    input: {
        'module': 'module.ts',
        'panel/module': 'panel/module.ts',
        'datasource/module': 'datasource/module.ts',
    },
    output: {
        dir: '../../dist/raalabs-action-button-app',
        sourcemap: true,
        format: 'amd',
    },
    plugins: [
        typescript(),
        copy({
            targets:[
                { 
                    src: 'plugin.json',
                    dest: '../../dist/raalabs-action-button-app',
                    transform: (contents) => contents.toString()
                        .replace('%TODAY%', new Date().toISOString())
                        .replace('%VERSION%', '1.0.0')
                },
                { src: 'panel/plugin.json', dest: '../../dist/raalabs-action-button-app/panel' },
                { src: 'datasource/plugin.json', dest: '../../dist/raalabs-action-button-app/datasource' },
            ],
        }),
    ],
    external: [
        '@grafana/data',
        '@grafana/ui',
        'react',
        'react-dom',
    ],
});
