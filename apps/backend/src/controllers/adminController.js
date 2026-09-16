const { prisma } = require("../lib/prisma.js");

async function getAllUsers (req, res, next) {
    try {
        const users = await prisma.user.findMany({
            omit: {
                hash: true,
                salt: true,
                iterationCount: true
            }
        })
        console.log(users);
        return res.json({ users });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getUsersByPage (req, res, next) {
    const SHOWN_USERS = 10;

    try {
        const users = await prisma.user.findMany({
            omit: {
                hash: true,
                salt: true,
                iterationCount: true
            }
        }).take(SHOWN_USERS).skip(Number(req.params.pageNum) * SHOWN_USERS)
        console.log(users);
        return res.json({ users });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getUserById (req, res, next) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.userId
            },
            omit: {
                hash: true,
                salt: true,
                iterationCount: true
            }
        })
        return res.json({ user });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getBlogs (req, res, next) {
    try {
        const blogs = await prisma.blogPost.findMany()
        return res.json({ blogs });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getBlogById (req, res, next) {
    try {
        const blog = await prisma.blogPost.findUnique({
            where: {
                id: req.params.blogId
            }
        })
        return res.json({ blog });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function postBlogById (req, res, next) {
    try {
        await prisma.blogPost.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                published: req.body.published
            }
        })
        return res.json({ message: "Blog post posted!" });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function updateBlogById (req, res, next) {
    try {
        await prisma.blogPost.update({
            data: {
                title: req.body.title,
                content: req.body.content,
                published: req.body.published
            },
            where: {
                id: req.params.blogId
            }
        })
        return res.json({ message: "Blog post updated!" });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function deleteBlogById (req, res, next) {
    try {
        await prisma.blogPost.delete({
            where: {
                id: req.params.blogId
            }
        })
        return res.json({ message: "Blog post deleted!" });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function deleteCommentById (req, res, next) {
    try {
        await prisma.comment.delete({
            where: {
                id: req.params.commentId
            }
        })
        return res.json({ message: "Comment deleted!" });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

module.exports = {
    getAllUsers,
    getUsersByPage,
    getUserById,
    getBlogs,
    getBlogById,
    postBlogById,
    updateBlogById,
    deleteBlogById,
    deleteCommentById,
};
