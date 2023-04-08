module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    [
      "module-resolver",
      {
        alias: {
          navigators: "./src/navigators",
          components: "./src/components",
          constants: "./src/constants",
          services: "./src/services",
          screens: "./src/screens",
          shared: "./src/shared",
          config: "./src/config",
          assets: "./src/assets",
          reduxCore: "./src/reduxCore",
          stores: "./src/stores",
        },
      },
    ],
    ['react-native-reanimated/plugin'],

  ],
  env: {
    production: {
      plugins: ["transform-remove-console"],
    },
  },
};
