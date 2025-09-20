const express = require("express");
const path = require("path");
const fs = require("fs");
// const { title } = require("process");

const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const fileInfo = [];

  fs.readdir(`./files`, (err, files) => {
    let pending = files.length;
    if (!pending) res.render("index", { fileInfo });

    files.forEach((file) => {
      fs.readFile(`./files/${file}`, "utf-8", (err, data) => {
        fileInfo.push({ name: file, content: data });

        pending -= 1;
        if (pending === 0) res.render("index", { fileInfo });
      });
    });
  });
});

app.post("/create", (req, res) => {
  const title = req.body.title
    .split(" ")
    .map((word, index) => {
      if (index > 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join("");

  const details = req.body.details;
  fs.writeFile(`./files/${title}.txt`, details, (err) => {
    if (!err) return;
    console.error(err);
  });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
