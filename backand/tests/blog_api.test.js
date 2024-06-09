const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

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

// test("blog can be added", async () => {
//   const newBlog = {
//     title: "This is a new Blog Post",
//     author: "Bob Miller",
//     url: "https://example.com/test",
//     likes: 150,
//   };

//   await api
//     .post("/api/blogs")
//     .send(newBlog)
//     .expect(201)
//     .expect("Content-Type", /application\/json/);

//   const blogsAtEnd = await helper.blogsInDb();
//   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

//   const titles = blogsAtEnd.map((blog) => blog.title);
//   assert(titles.includes(newBlog.title));
// });

test("blog can be added", async () => {
  const newBlog = {
    title: "This is a new Blog Post",
    author: "Bob Miller",
    url: "https://example.com/test",
    likes: 130,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1);

  const contents = blogAtEnd.map((b) => b.title);
  assert(contents.includes("This is a new Blog Post"));
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

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "asmith",
      name: "Alice Smith",
      password: "testpass",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});

after(async () => {
  await mongoose.connection.close();
});
