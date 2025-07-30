const path = require("path");

module.exports = {
  // ... other webpack config ...
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"], // add your extensions here
  },
};
