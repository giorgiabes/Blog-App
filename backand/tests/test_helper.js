const Blog = require("../models/blog");

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

module.exports = {
  initialBlogs,
  blogsInDb,
};
