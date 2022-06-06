const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const { error } = require("../utils/logger");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = request.user;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

// blogsRouter.delete("/:id", async (request, response) => {
//   await Blog.findByIdAndRemove(request.params.id);
//   response.status(204).end();
// });

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = request.user;

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: "token invalid" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: "query" }
  );
  response.json(updatedBlog);
});

module.exports = blogsRouter;
