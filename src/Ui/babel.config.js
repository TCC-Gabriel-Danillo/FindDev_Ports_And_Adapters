module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@domain": "../domain",
            "@infrastructure": "../infrastructure",
            "@ui": "../ui",
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "react-native-dotenv",
          path: ".env",
        },
      ],
    ],
  };
};
