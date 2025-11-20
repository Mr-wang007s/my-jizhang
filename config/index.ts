import path from 'path';
import type { UserConfigExport } from '@tarojs/cli';

export default {
  projectName: 'my-jizhang',
  date: '2025-11-20',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    375: 2,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false },
  },
  cache: {
    enable: false,
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // Ignore Tailwind utility classes
          selectorBlackList: [
            /^\.bg-/,
            /^\.text-/,
            /^\.p-/,
            /^\.m-/,
            /^\.flex/,
            /^\.grid/,
            /^\.w-/,
            /^\.h-/,
            /^\.rounded/,
            /^\.shadow/,
          ],
        },
      },
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    webpackChain(chain) {
      // Optimize bundle size with code splitting
      chain.merge({
        optimization: {
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              common: {
                name: 'common',
                minChunks: 2,
                priority: 1,
              },
              vendors: {
                name: 'vendors',
                minChunks: 2,
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
              },
              echarts: {
                name: 'echarts',
                priority: 200,
                test: /[\\/]node_modules[\\/]echarts[\\/]/,
              },
            },
          },
        },
      });
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js',
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[name].[chunkhash:8].css',
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  rn: {
    appName: 'myjizhang',
    postcss: {
      cssModules: {
        enable: false,
      },
    },
  },
} satisfies UserConfigExport;
