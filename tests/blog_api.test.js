const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const api = supertest(app);

const initialBlogs = [
  {
    title: "google",
    author: "Google",
    url: "https://www.google.com/",
    likes: 14,
  },
  {
    title: "yahoo",
    author: "Yahoo",
    url: "https://en-maktoob.yahoo.com/",
    likes: 19,
  },
];
beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
}, 10000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(2);
});
test("the first blog is google", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].title).toBe("google");
});
afterAll(() => {
  mongoose.connection.close();
});

test("all the blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("identifier id is defined", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("content can be added to blogs", async () => {
  const newBlog = {
    title: "fullstack En",
    author: "Helsinky",
    url: "https://fullstackopen.com/en/",
    likes: 70,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const titles = response.body.map((blog) => blog.title);
  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain(newBlog.title);
});

test("content with no likes defaults like to zero", async () => {
  const newBlog = {
    title: "youtube",
    author: "Y",
    url: "https://www.youtube.com/",
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  expect(response.body[2].likes).toBe(0);
});

test("content without title or url isn't added", async () => {
  const blogOne = {
    author: "x",
    url: "https://www.youtube.com/",
  };
  const blogTwo = {
    title: "youyube",
    author: "y",
  };
  await api.post("/api/blogs").send(blogOne).expect(400);

  await api.post("/api/blogs").send(blogTwo).expect(400);
});
