const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/notification-form.html"));
});

app.post("/submit", (req, res) => {
  // For testing, just return the received form data as JSON
  res.send(
    `<pre>${JSON.stringify(req.body, null, 2)}</pre><a href="/">Back</a>`
  );
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
