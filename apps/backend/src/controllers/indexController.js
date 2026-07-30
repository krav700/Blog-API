const { prisma } = require("../lib/prisma.js");

async function getHomePage(req, res, next) {
    let folders = [];
    let files = [];

    const allowedOrderFields = ["name", "size", "uploadedAt", "updatedAt", "mimeType"];

    const order = allowedOrderFields.includes(req.params.orderBy)
        ? req.params.orderBy
        : null;

    if (req.user) {
        [folders, files] = await Promise.all([
        await prisma.folder.findMany({
            where: {
                parentId: null,
                userId: req.user.id,
            },
            ...(order == "name" && {orderBy: { [order]: "desc", },})
        }),
        
        await prisma.file.findMany({
            where: {
                userId: req.user.id,
                OR: [{ folderId: 0 }, { folderId: null }],
            },
            ...(order && {orderBy: { [order]: "desc", },})
        })
        ]);
    }
    
    return res.render("index", { title: "Home", folders: folders, files: files });
}

module.exports = {
    getHomePage,
};
