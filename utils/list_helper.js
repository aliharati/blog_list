const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  return likes.reduce((sum, num) => num + sum);
};

const favoriteBlog = (blogs) => {
  return blogs.map((blog) => blog.likes).sort((a, b) => b - a)[0];
};

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const authorCount = {};

  authors.forEach((name) => {
    authorCount[name] = (authorCount[name] || 0) + 1;
  });
  const favoriteAuthor = Object.keys(authorCount).reduce((a, b) =>
    authorCount[a] > authorCount[b] ? a : b
  );
  return { author: favoriteAuthor, blogs: authorCount[favoriteAuthor] };
};

const mostLikes = (blogs) => {
  const authorCount = {};
  blogs.forEach((blog) => {
    if (authorCount[blog.author]) {
      authorCount[blog.author] += blog.likes;
    } else {
      authorCount[blog.author] = blog.likes;
    }
  });
  const favoriteAuthor = Object.keys(authorCount).reduce((a, b) =>
    authorCount[a] > authorCount[b] ? a : b
  );
  return { author: favoriteAuthor, likes: authorCount[favoriteAuthor] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
