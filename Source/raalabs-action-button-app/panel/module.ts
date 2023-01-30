import { PanelPlugin } from '@grafana/data';

import { ButtonPanel } from './ButtonPanel';

console.log('Panel is loading');

export const plugin = new PanelPlugin(ButtonPanel)
    .setPanelOptions(_ => _
        .addColorPicker({
            path: 'color',
            name: 'Color',
        })
    );
