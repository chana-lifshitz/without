const store = require('../store');
const { ALLERGEN_KEYS } = require('../allergens');

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

const findMaxReplyId = (replies) =>
    (replies || []).reduce(
        (maxId, reply) => Math.max(maxId, Number(reply.id) || 0, findMaxReplyId(reply.replies)),
        0
    );

class Forum_repository {
    constructor() {}

    readData() {
        const data = store.read('forum');
        data.posts = data.posts || [];
        return data;
    }

    writeData(data) {
        store.write('forum', data);
    }

    async getAllPosts() {
        return this.readData().posts;
    }

    async getPostById(id) {
        const post = this.readData().posts.find(p => Number(p.id) === Number(id));
        return post || null;
    }

    async addPost(newPost) {
        const rawData = this.readData();
        const post = {
            id: rawData.posts.reduce(
                (maxId, existingPost) => Math.max(maxId, Number(existingPost.id) || 0),
                0
            ) + 1,
            author: newPost.author.trim(),
            authorId: newPost.authorId ?? null,
            title: newPost.title.trim(),
            content: newPost.content.trim(),
            category: newPost.category,
            image: (newPost.image || '').trim(),
            isExpert: Boolean(newPost.isExpert),
            sensitivity: ALLERGEN_KEYS.includes(newPost.sensitivity) ? newPost.sensitivity : 'general',
            likes: 0,
            likedBy: [],
            replies: [],
            createdAt: new Date().toISOString()
        };

        rawData.posts.push(post);
        this.writeData(rawData);
        return post;
    }

    async addReply(postId, reply) {
        const rawData = this.readData();
        const post = rawData.posts.find(p => Number(p.id) === Number(postId));

        if (!post)
            return null;

        post.replies = post.replies || [];

        const newReply = {
            id: Math.max(Date.now(), findMaxReplyId(post.replies) + 1),
            author: reply.author.trim(),
            authorId: reply.authorId ?? null,
            text: reply.text.trim(),
            image: (reply.image || '').trim(),
            isExpert: Boolean(reply.isExpert),
            createdAt: new Date().toISOString(),
            replies: []
        };

        if (reply.replyingTo === null || reply.replyingTo === undefined) {
            post.replies.push(newReply);
        } else {
            const parentReply = findReply(post.replies, reply.replyingTo);
            if (!parentReply)
                throw new Error('Reply to reply not found');

            parentReply.replies = parentReply.replies || [];
            parentReply.replies.push(newReply);
        }

        this.writeData(rawData);
        return post;
    }

    async toggleLike(postId, userId) {
        const rawData = this.readData();
        const post = rawData.posts.find(p => Number(p.id) === Number(postId));

        if (!post)
            return null;

        post.likedBy = (post.likedBy || []).map(String);
        const userKey = String(userId);

        if (post.likedBy.includes(userKey)) {
            post.likedBy = post.likedBy.filter(id => id !== userKey);
            post.likes = Math.max(0, (Number(post.likes) || 0) - 1);
        } else {
            post.likedBy.push(userKey);
            post.likes = (Number(post.likes) || 0) + 1;
        }

        delete post.liked;
        this.writeData(rawData);
        return post;
    }

    async deletePost(postId) {
        const rawData = this.readData();
        const index = rawData.posts.findIndex(p => Number(p.id) === Number(postId));

        if (index === -1)
            return null;

        const deletedPost = rawData.posts.splice(index, 1)[0];
        this.writeData(rawData);
        return deletedPost;
    }

    async deleteReply(postId, replyId) {
        const rawData = this.readData();
        const post = rawData.posts.find(p => Number(p.id) === Number(postId));

        if (!post)
            return null;

        // מוחקים את התגובה יחד עם התגובות שנכתבו אליה
        let removed = null;
        const removeFrom = replies => (replies || []).filter(reply => {
            if (Number(reply.id) === Number(replyId)) {
                removed = reply;
                return false;
            }
            reply.replies = removeFrom(reply.replies);
            return true;
        });
        post.replies = removeFrom(post.replies);

        if (!removed)
            throw new Error('Reply not found');

        this.writeData(rawData);
        return post;
    }
}

module.exports = new Forum_repository();
