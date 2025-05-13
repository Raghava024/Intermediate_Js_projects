import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API = "http://localhost:4000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const { data: posts } = await axios.get(`${API}/posts`);
    res.render("index.ejs", { posts });
  } catch (err) {
    res.status(500).send("Failed to load posts");
  }
});

app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const { data: post } = await axios.get(`${API}/posts/${req.params.id}`);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post,
    });
  } catch (err) {
    res.status(500).send("Failed to load post");
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    await axios.post(`${API}/posts`, req.body);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed to create post");
  }
});

app.post("/api/posts/:id", async (req, res) => {
  try {
    await axios.patch(`${API}/posts/${req.params.id}`, req.body);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed to update post");
  }
});

app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed to delete post");
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
