const forumRepository = require('../Repositories/forum.repository');
const permissions = require('../permissions');

const canModify = (item, user) =>
    permissions.canModify(item.authorId, item.author, user);

const getUser = async userId => {
    const user = await permissions.findUser(userId);
    if (!user)
        throw new Error('Forbidden');
    return user;
};

const findReply = (replies, replyId) => {
    for (const reply of replies || []) {
        if (Number(reply.id) === Number(replyId))
            return reply;
        const found = findReply(reply.replies, replyId);
        if (found)
            return found;
    }
    return null;
};

class Forum_service {
    constructor() {}

    async getAllPosts() {
        return await forumRepository.getAllPosts();
    }

    async getPostById(id) {
        const post = await forumRepository.getPostById(id);

        if (!post) {
            throw new Error("Post not found");
        }

        return post;
    }

    async addPost(newPost) {
        return await forumRepository.addPost(newPost);
    }

    async addReply(postId, reply) {
        const updatedPost = await forumRepository.addReply(postId, reply);

        if (!updatedPost) {
            throw new Error("Post not found");
        }

        return updatedPost;
    }

    async toggleLike(postId, userId) {
        const updatedPost = await forumRepository.toggleLike(postId, userId);

        if (!updatedPost) {
            throw new Error("Post not found");
        }

        return updatedPost;
    }

        async deletePost(postId, userId) {
        const user = await getUser(userId);
        const post = await forumRepository.getPostById(postId);

        if (!post) {
            throw new Error("Post not found");
        }
        if (!canModify(post, user)) {
            throw new Error("Forbidden");
        }

        const deletedPost = await forumRepository.deletePost(postId);

        if (!deletedPost) {
            throw new Error("Post not found");
        }

        return deletedPost;
    }

    async deleteReply(postId, replyId, userId) {
        const user = await getUser(userId);
        const post = await forumRepository.getPostById(postId);

        if (!post) {
            throw new Error("Post not found");
        }

        const reply = findReply(post.replies, replyId);
        if (!reply) {
            throw new Error("Reply not found");
        }
        if (!canModify(reply, user)) {
            throw new Error("Forbidden");
        }

        return await forumRepository.deleteReply(postId, replyId);
    }
}

module.exports = new Forum_service();