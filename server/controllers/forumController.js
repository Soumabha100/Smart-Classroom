const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.id; // Assuming you have user info in the request

    const post = new Post({ title, content, author });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name'
                }
            });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const author = req.user.id;
    const post = req.params.postId;

    const comment = new Comment({ text, author, post });
    await comment.save();

    const relatedPost = await Post.findById(post);
    relatedPost.comments.push(comment);
    await relatedPost.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};