const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const blogs = require("./blogs");

describe("favorite blog", () => {
  const emptyList = [];
  const listWithOneBlog = [blogs[0]];
  const biggerList = blogs;

  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog(emptyList);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, equals that blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    });
  });

  test("of a bigger list is detected correctly", () => {
    const result = listHelper.favoriteBlog(biggerList);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});
