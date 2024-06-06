const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@cluster0.eq26buq.mongodb.net/testBlogApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const blog = new Blog({
  title: "A Guide to Responsive Web Design",
  author: "Jane Smith",
  url: "https://example.com/responsive-design",
  likes: 150,
});

blog.save().then((result) => {
  console.log("blog saved");
  mongoose.connection.close();
});
