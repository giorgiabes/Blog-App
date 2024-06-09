const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Understanding JavaScript Closures",
    author: "John Doe",
    url: "https://example.com/js-closures",
    likes: 120,
  },
  {
    title: "A Guide to Responsive Web Design",
    author: "Jane Smith",
    url: "https://example.com/responsive-design",
    likes: 200,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
};
