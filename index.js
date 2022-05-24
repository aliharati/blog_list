require("dotenv").config();
const http = require("http");
const Blog = require("./models/blog");
const cors = require("cors");
const express = require("express");
const app = express();
const { append } = require("express/lib/response");

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  blog.save().then((savedBlog) => {
    response.json(savedBlog);
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
