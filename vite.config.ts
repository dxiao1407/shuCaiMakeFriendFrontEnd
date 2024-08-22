import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from '@vant/auto-import-resolver';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        //Vant 组件将会按需自动引入。↓
        AutoImport({
            resolvers: [VantResolver()],
        }),
        Components({
            resolvers: [VantResolver()],
        }),
        //↑

    ],
})
