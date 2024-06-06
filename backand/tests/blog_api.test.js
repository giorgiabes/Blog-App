const { test, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

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

after(async () => {
  await mongoose.connection.close();
});
