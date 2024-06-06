const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[2]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, 2);
});

test("unique identifier is named id", async () => {
  const response = await api.get("/api/blogs");
  const property = Object.keys(response._body[0]);
  const identifierProperty = property[property.length - 1];
  assert.strictEqual(identifierProperty, "id");
});

test("blog can be added", async () => {
  const newBlog = {
    title: "Exploring the MERN Stack",
    author: "Alice Johnson",
    url: "https://example.com/mern-stack",
    likes: 150,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  assert(titles.includes(newBlog.title));
});

test("single blog is deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  const contents = blogsAtEnd.map((b) => b.title);
  assert(!contents.includes(blogToDelete.title));
});

after(async () => {
  await mongoose.connection.close();
});
