const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcryptjs");
const Blog = require("../models/blog");
const User = require("../models/user");
const user = require("../models/user");
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
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("password", 10);
  const user = new User({
    username: "root",
    name: "admin",
    blogs: [],
    passwordHash,
  });
  await user.save();
}, 13000);
beforeEach(async () => {
  userId = await User.findOne({});
  console.log("user", userId);

  await Blog.deleteMany({});
  for (let blog of initialBlogs) {
    blog.user = userId;
    console.log(blog);
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
}, 10000);

describe("blog returns", () => {
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

  test("all the blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(initialBlogs.length);
  });
});

describe("view a specific blog", () => {
  test("the first blog is google", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].title).toBe("google");
  });

  test("identifier id is defined", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });
});

describe("adding new content", () => {
  let headers;

  beforeEach(async () => {
    const user = {
      username: "root",
      password: "password",
    };

    const loginUser = await api.post("/api/login").send(user);

    headers = {
      Authorization: `bearer ${loginUser.body.token}`,
    };
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
      .set(headers)
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
      .set(headers)
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
    await api.post("/api/blogs").send(blogOne).set(headers).expect(400);

    await api.post("/api/blogs").send(blogTwo).set(headers).expect(400);
  });
});

describe("updating and deleting a notes", () => {
  let headers;
  beforeEach(async () => {
    const user = {
      username: "root",
      password: "password",
    };
    const loginUser = api.post("/api/login").send(user);
    headers = {
      Authorization: `bearer ${(await loginUser).body.token}`,
    };
  });
  test("deleting a blog succeeds with status code 204", async () => {
    const blogsAtStart = await (
      await Blog.find({})
    ).map((blog) => blog.toJSON());
    const blogToDelete = blogsAtStart[1];

    await api.delete(`/api/blogs/${blogToDelete.id}`).set(headers).expect(204);
    const blogsAtEnd = await (await Blog.find({})).map((blog) => blog.toJSON());
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
  }, 13000);

  test("updating a blogs title and likes is successful", async () => {
    const blogsAtStart = await (
      await Blog.find({})
    ).map((blog) => blog.toJSON());
    blogToUpdate = blogsAtStart[0];
    const newBlog = {
      title: "googles landing",
      author: "Google",
      url: "https://www.google.com/",
      likes: 17,
    };
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(200);
    const blogsAtEnd = await (await Blog.find({})).map((blog) => blog.toJSON());
    expect(blogsAtEnd[0].title).toBe("googles landing");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
