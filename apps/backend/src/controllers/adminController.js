const { prisma } = require("../lib/prisma.js");

async function getCurrentUser(req, res, next) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user?.id,
            },
            omit: {
                hash: true,
                salt: true,
                iterationCount: true,
            },
        });

        if (!user) {
            console.log("User does not exist");
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ user });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getAllUsers(req, res, next) {
    try {
        const users = await prisma.user.findMany({
            omit: {
                hash: true,
                salt: true,
                iterationCount: true,
            },
            take: 10,
            orderBy: {
                username: "asc",
            },
        });
        return res.json({ users });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getUsersByPage(req, res, next) {
    const SHOWN_USERS = 10;

    try {
        const users = await prisma.user.findMany({
            omit: {
                hash: true,
                salt: true,
                iterationCount: true,
            },
            orderBy: {
                username: "asc",
            },
            take: SHOWN_USERS,
            skip: Number(req.params.pageNum) * SHOWN_USERS,
        });
        return res.json({ users });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getUserById(req, res, next) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.userId,
            },
            omit: {
                hash: true,
                salt: true,
                iterationCount: true,
            },
        });
        return res.json({ user });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function updateUser(req, res, next) {
    try {
        await prisma.user.update({
            where: {
                id: req.params.userId,
            },
            data: {
                isAdmin: req.body.isAdmin,
            },
        });
        return res.json({ message: "User updated successfully!" });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function deleteUser(req, res, next) {
    const SHOWN_USERS = 10;

    try {
        await prisma.user.delete({
            where: {
                id: req.params.userId,
            },
        });

        const users = await prisma.user.findMany({
            omit: {
                hash: true,
                salt: true,
                iterationCount: true,
            },
            orderBy: {
                username: "asc",
            },
            take: SHOWN_USERS,
            skip: Number(req.params.pageNum ?? 0) * SHOWN_USERS,
        });

        return res.json({ message: "User post deleted!", users });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getBlogs(req, res, next) {
    try {
        const blogs = await prisma.blogPost.findMany({
            take: 10,
            orderBy: {
                createdAt: "asc",
            },
        });
        return res.json({ blogs });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getBlogById(req, res, next) {
    try {
        const blog = await prisma.blogPost.findUnique({
            where: {
                id: req.params.blogId,
            },
            include: {
                comments: {
                    orderBy: {
                        createdAt: "asc",
                    },
                    take: 10,
                    include: {
                        authoredBy: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
            },
        });
        return res.json({ blog });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getBlogsByPage(req, res, next) {
    const SHOWN_BLOGS = 10;

    try {
        const blogs = await prisma.blogPost.findMany({
            orderBy: {
                createdAt: "asc",
            },
            take: SHOWN_BLOGS,
            skip: Number(req.params.pageNum) * SHOWN_BLOGS,
        });
        return res.json({ blogs });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function postBlogById(req, res, next) {
    try {
        await prisma.blogPost.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                published: req.body.published,
            },
        });
        return res.json({ message: "Blog post posted!" });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function updateBlogById(req, res, next) {
    try {
        await prisma.blogPost.update({
            data: {
                title: req.body.title,
                content: req.body.content,
                published: req.body.published,
            },
            where: {
                id: req.params.blogId,
            },
        });
        return res.json({ message: "Blog post updated!" });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function deleteBlogById(req, res, next) {
    try {
        await prisma.blogPost.delete({
            where: {
                id: req.params.blogId,
            },
        });
        return res.json({ message: "Blog post deleted!" });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function getCommentsByPage(req, res, next) {
    const SHOWN_COMMENTS = 10;

    try {
        const comments = await prisma.comment.findMany({
            include: {
                authoredBy: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
            take: SHOWN_COMMENTS,
            skip: Number(req.params.pageNum) * SHOWN_COMMENTS,
        });
        if (!comments) {
            return res.json({ error: "No comments on this page" });
        }
        return res.json({ comments });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

async function deleteCommentById(req, res, next) {
    try {
        await prisma.comment.delete({
            where: {
                id: req.params.commentId,
            },
        });
        const comments = await prisma.comment.findMany({
            include: {
                authoredBy: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        return res.json({ message: "Comment deleted!", comments });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

module.exports = {
    getCurrentUser,
    getAllUsers,
    getUsersByPage,
    getUserById,
    updateUser,
    deleteUser,
    getBlogs,
    getBlogsByPage,
    getBlogById,
    postBlogById,
    updateBlogById,
    deleteBlogById,
    getCommentsByPage,
    deleteCommentById,
};
