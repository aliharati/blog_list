const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "Godasdasdasdasd",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.io/Go_To_Considered_Harmful.html",
      likes: 10,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(15);
  });
});

describe("Most likes", () => {
  const listWiththreeBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "Godasdasdasdasd",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.io/Go_To_Considered_Harmful.html",
      likes: 10,
      __v: 0,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    {
      title: " reduction",
      author: "happy",
      likes: 14,
    },
    {
      title: "Cano reduction",
      author: "happy",
      likes: 11,
    },
  ];

  test("most likes 14", () => {
    const result = listHelper.favoriteBlog(listWiththreeBlogs);
    expect(result).toBe(14);
  });
});

describe("highest author", () => {
  const myBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "Godasdasdasdasd",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.io/Go_To_Considered_Harmful.html",
      likes: 10,
      __v: 0,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    {
      title: " reduction",
      author: "happy",
      likes: 14,
    },
    {
      title: "Cano reduction",
      author: "happy",
      likes: 11,
    },
  ];

  test("most published Edsger W. Dijkstra", () => {
    const result = listHelper.mostBlogs(myBlogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 3,
    });
  });
});

describe("Most liked Author", () => {
  const theBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "Godasdasdasdasd",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.io/Go_To_Considered_Harmful.html",
      likes: 10,
      __v: 0,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    {
      title: " reduction",
      author: "happy",
      likes: 34,
    },
    {
      title: "Cano reduction",
      author: "happy",
      likes: 11,
    },
  ];

  test("most liked happy", () => {
    const result = listHelper.mostLikes(theBlogs);
    expect(result).toEqual({
      author: "happy",
      likes: 45,
    });
  });
});
