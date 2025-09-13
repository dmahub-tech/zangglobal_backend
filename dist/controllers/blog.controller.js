"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const blog_model_1 = __importStar(require("../models/blog.model"));
class BlogManager {
    constructor() {
        // Initialize any properties or dependencies here
    }
    // Method to create a new blog post
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Logic to create a new blog post
                const DTOs = req.body;
                // Create a new blog post
                yield blog_model_1.default.create(DTOs);
                res
                    .status(201)
                    .json({ message: "Post created successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error creating post", error, status: false });
            }
        });
    }
    // Method to fetch all blog posts
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to fetch all blog posts
            try {
                const post = yield blog_model_1.default.find();
                res
                    .status(200)
                    .json({ post, message: "Posts fetched successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error fetching posts", error, status: false });
            }
        });
    }
    // Method to update a blog post
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const newUpdates = req.body;
                // Update the blog post
                yield blog_model_1.default.findByIdAndUpdate(id, Object.assign({}, newUpdates));
                res
                    .status(200)
                    .json({ message: "Post updated successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error updating post", error, status: false });
            }
        });
    }
    // Method to delete a blog post
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Delete the blog post
                yield blog_model_1.default.findByIdAndDelete(id);
                res
                    .status(200)
                    .json({ message: "Post deleted successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error deleting post", error, status: false });
            }
        });
    }
    // Method to get a single blog post
    getSinglePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Fetch the blog post by ID
                const post = yield blog_model_1.default.findById(id);
                if (!post) {
                    res.status(404).json({ message: "Post not found", status: false });
                    return;
                }
                res
                    .status(200)
                    .json({ post, message: "Post fetched successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error fetching post", error, status: false });
            }
        });
    }
    // Comment on a blog post
    commentOnPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const { content } = req.body;
                // Create a new comment
                const comment = yield blog_model_1.Comment.create({ content });
                yield blog_model_1.default.findByIdAndUpdate(postId, {
                    $push: { comments: comment._id },
                });
                res
                    .status(201)
                    .json({ message: "Comment added successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error adding comment", error, status: false });
            }
        });
    }
    // Method to update views count
    updateViews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                // Increment the views count
                const post = yield blog_model_1.default.findOne({ id: postId });
                if (!post) {
                    res.status(404).json({ message: "Post not found", status: false });
                    return;
                }
                post.views += 1;
                yield post.save();
                res
                    .status(200)
                    .json({ message: "Views updated successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error updating views", error, status: false });
            }
        });
    }
    // Method to like a blog post
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                // Increment the likes count
                yield blog_model_1.default.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
                res
                    .status(200)
                    .json({ message: "Post liked successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error liking post", error, status: false });
            }
        });
    }
    // Method to dislike a blog post
    dislikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                // Assuming you have a Blog model to interact with your database
                // Increment the dislikes count
                yield blog_model_1.default.findByIdAndUpdate(postId, { $inc: { dislikes: 1 } });
                res
                    .status(200)
                    .json({ message: "Post disliked successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error disliking post", error, status: false });
            }
        });
    }
    // Method to get all comments on a blog post
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                // Assuming you have a Blog model to interact with your database
                // Fetch the blog post by ID and populate the comments
                const post = yield blog_model_1.default.findById(postId).populate("comments");
                if (!post) {
                    res.status(404).json({ message: "Post not found", status: false });
                    return;
                }
                res.status(200).json({
                    comments: post.comments,
                    status: true,
                    message: "Comments fetched successfully",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error fetching comments", error, status: false });
            }
        });
    }
    // Method to delete a comment
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, commentId } = req.params;
                // Delete the comment
                yield blog_model_1.Comment.findByIdAndDelete(commentId);
                yield blog_model_1.default.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
                res
                    .status(200)
                    .json({ message: "Comment deleted successfully", status: true });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error deleting comment", error, status: false });
            }
        });
    }
}
exports.default = BlogManager;
