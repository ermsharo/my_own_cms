const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sequelize setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

// Define the 'Post' model
const Post = sequelize.define('Post', {
  title: DataTypes.STRING,
  cover_image: DataTypes.STRING,
  text: DataTypes.TEXT,
  tags: DataTypes.STRING,
});

// Sync the model with the database (create the 'posts' table if it doesn't exist)
sequelize.sync();

// Route to create a new post
app.post('/create-post', async (req, res) => {
  try {
    const { title, cover_image, text, tags } = req.body;
    const post = await Post.create({
      title,
      cover_image,
      text,
      tags,
    });
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating post' });
  }
});

// Route to update a post by ID
app.put('/update-post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, cover_image, text, tags } = req.body;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.update({ title, cover_image, text, tags });
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating post' });
  }
});

// Route to get all posts as JSON
app.get('/get-posts', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting posts' });
  }
});

app.delete('/delete-post/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      await post.destroy();
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting post' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
