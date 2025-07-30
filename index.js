const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
