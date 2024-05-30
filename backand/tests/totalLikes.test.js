const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const allBlogs = require("./blogs");

describe("total likes", () => {
  const emptyList = [];
  const listWithOneBlog = [allBlogs[0]];
  const biggerList = allBlogs;

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(emptyList);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 7);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(biggerList);
    assert.strictEqual(result, 36);
  });
});
