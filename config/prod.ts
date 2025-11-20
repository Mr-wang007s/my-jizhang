export default {
  env: {
    NODE_ENV: '"production"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    /**
     * WebpackChain can be used for custom webpack configuration
     * https://github.com/neutrinojs/webpack-chain
     */
    webpackChain(chain) {
      chain.merge({
        optimization: {
          minimize: true,
          usedExports: true,
        },
      });
    },
  },
};
