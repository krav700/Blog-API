const { prisma } = require("../lib/prisma.js");

async function getBlogs (req, res, next) {
    try {
        const blogs = await prisma.blogPost.findMany()
        return res.json({ blogs });
    } catch (err) {
        return res.json({ message: err.message });
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
        return res.json({ message: err.message });
    }
}

async function getBlogComments (req, res, next) {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                blogId: req.params.blogId
            },
            include: {
                authoredBy: {
                    select: {
                        username: true
                    }
                }
            }
        })
        return res.json({ comments });
    } catch (err) {
        return res.json({ message: err.message });
    }
}

async function updateBlogComment (req, res, next) {
    try {
        await prisma.comment.update({
            data: {
                content: req.body.content
            },
            where: {
                id: req.params.content
            }
        })
        return res.json({ message: "Comment updated!" });
    } catch (err) {
        return res.json({ message: err.message });
    }
}

async function postBlogComment (req, res, next) {
    console.log(req.user)
    try {
        await prisma.comment.create({
            data: {
                content: req.body.content,
                authorId: req.user.id,
                blogId: req.params.blogId
            }
        })
        return res.json({ message: "Comment created!" });
    } catch (err) {
        return res.json({ message: err.message });
    }
}

async function deleteBlogComment (req, res, next) {
    try {
        await prisma.comment.delete({
            where: {
                id: req.params.commentId,
                authoredBy: req.user
            }
        })
        return res.json({ message: "Comment deleted!" });
    } catch (err) {
        return res.json({ message: err.message });
    }
}


module.exports = {
    getBlogs,
    getBlogById,
    getBlogComments,
    updateBlogComment,
    postBlogComment,
    deleteBlogComment
};
