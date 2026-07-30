const { body, validationResult, matchedData } = require("express-validator");
const passwordUtils = require("../lib/passwordUtils.js");
const { prisma } = require("../lib/prisma.js");
const passport = require("passport");
const crypto = require("crypto");
const getBreadcrumbs = require("../lib/breadcrumbs.js");
const formatBytes = require("../lib/formBytes.js");

const validateFolderName = [
    body("folder")
        .trim()
        .notEmpty()
        .withMessage(`Folder name must not be empty.`)
        .isLength({ min: 3, max: 50 })
        .withMessage(`Folder name must be between 3 and 50 characters.`)
        .custom(async (value, { req }) => {
            const parentId = req.params.folderId
                ? Number(req.params.folderId)
                : null;
            const folder = await prisma.folder.findFirst({
                where: {
                    name: value,
                    parentId,
                },
            });
            if (folder) {
                throw new Error();
            }
            return true;
        })
        .withMessage(`Folder name already exists.`),
];

async function getFolderCreateForm(req, res, next) {
    if (req.params.folderId && req.params.folderId != 0) {
        const currentFolder = await prisma.folder.findFirst({
            where: {
                id: Number(req.params.folderId),
                userId: req.user.id,
            },
        });

        if (!currentFolder) {
            return res.render("errorPages/errorPage", {
                errorMessage: "That folder does not exist in your storage!"
            })
        }

        return res.render("forms/createFolder", {
            title: "Create Folder",
            folderId: req.params.folderId,
        });
    }
    return res.render("forms/createFolder", { title: "Create Folder" });
}

async function getFolderEditForm(req, res, next) {
    const currentFolder = await prisma.folder.findFirst({
        where: {
            id: Number(req.params.folderId),
            userId: req.user.id,
        },
    });

    if (!currentFolder) {
        return res.render("errorPages/errorPage", {
            errorMessage: "That folder does not exist in your storage!"
        })
    }

    if (req.params.folderId) {
        return res.render("forms/editFolder", {
            title: "Edit Folder",
            folderId: req.params.folderId,
            oldName: currentFolder.name,
        });
    }
    return res.render("forms/editFolder", { title: "Edit Folder" });
}

const createFolder = [
    validateFolderName,
    async (req, res, next) => {
        const { folder } = req.body;

        const paramFolderId = req.params.folderId;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render(`forms/createFolder`, {
                title: "Create Folder",
                errors: errors.array(),
                folder,
                folderId: paramFolderId,
            });
        }

        if (!paramFolderId || paramFolderId == 0) {
            try {
                await prisma.folder.create({
                    data: {
                        name: folder,
                        userId: req.user?.id,
                    },
                });
                return res.redirect("/");
            } catch (err) {
                return next(err);
            }
        }

        try {
            const checkParentOwner = await prisma.folder.findFirst({
                where: {
                    id: Number(paramFolderId),
                    userId: req.user.id,
                }
            })

            if (!checkParentOwner) {
                return res.redirect('/');
            }


            await prisma.folder.create({
                data: {
                    name: folder,
                    userId: req.user.id,
                    parentId: Number(paramFolderId),
                },
            });
            return res.redirect(`/folder/${paramFolderId}`);
        } catch (err) {
            return next(err);
        }
    },
];

const editFolder = [
    validateFolderName,
    async (req, res, next) => {
        const { folder } = req.body;

        const paramFolderId = req.params.folderId;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render(`forms/editFolder`, {
                title: "Edit Folder",
                errors: errors.array(),
                folder,
                folderId: paramFolderId,
            });
        }

        if (!paramFolderId || paramFolderId == 0) {
            return res.redirect("/");
        }

        try {
            const updatedFolder = await prisma.folder.update({
                data: {
                    name: folder,
                },
                where: {
                    id: Number(paramFolderId),
                    userId: req.user.id,
                },
            });
            if (!updatedFolder) {
                return res.render("errorPages/errorPage", {
                    errorMessage: "That folder does not exist in your storage!"
                })
            }
            return res.redirect(`/folder/${paramFolderId}`);
        } catch (err) {
            return next(err);
        }
    },
];
async function shareFolder(req, res, next) {
    const folderId = req.params.folderId;

    const sharedFolder = await prisma.shareableFolder.create({
        data: {
            token: crypto.randomBytes(12).toString("hex"),
            folderId: Number(folderId),
            expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)),
        },
    });

    res.render("shareFolder", {
        shareURL: `http://localhost:3000/folder/share/${sharedFolder.token}`,
    });
}

async function getFolderFiles(req, res, next) {
    const folderId = Number(req.params.folderId);

    if (!Number.isInteger(folderId)) {
        return next();
    }

    const order = req.params.orderBy;

    try {
        const folder = await prisma.folder.findFirst({
            where: {
                id: folderId,
                userId: req.user.id,
            },
            include: {
                children: true,
                parent: true,
                files: {
                    ...(order && { orderBy: { [order]: "desc" } }),
                },
            },
            ...(order == "name" && { orderBy: { [order]: "desc" } }),
        });

        if (!folder) {
            return res.render("errorPages/errorPage", {
                errorMessage: "That folder does not exist in your storage!"
            })
        }

        const breadcrumbs = getBreadcrumbs(folder);
        return res.render("folderContent", {
            title: folder.name,
            breadcrumbs: breadcrumbs,
            folderId: folderId,
            folderName: folder.name,
            folders: folder.children,
            files: folder.files,
        });
    } catch (err) {
        next(err);
    }
}

async function getSharedFolderFiles(req, res, next) {
    const { order, shareToken } = req.params;

    try {
        const checkExpiration = await prisma.shareableFolder.findFirst({
            where: {
                token: shareToken
            }
        })
        if (checkExpiration.expiresAt < new Date(Date.now())) {
            return res.render("shareFolder");
        }
    } catch (err) {
        console.log(err);
        return next();
    }

    try {
        const folder = await prisma.folder.findFirst({
            where: {
                shares: {
                    some: {
                        token: req.params.shareToken,
                    },
                },
            },
            include: {
                files: {
                    ...(order && { orderBy: { [order]: "desc" } }),
                },
            }
        });

        if (!Number.isInteger(folder.id)) {
            return next();
        }

        return res.render("folderContent", {
            title: folder.name,
            folderId: folder.id,
            shareToken: req.params.shareToken,
            folderName: folder.name,
            folders: folder.children,
            files: folder.files,
        });
    } catch (err) {
        console.log(err);
        return next();
    }
}

module.exports = {
    getFolderCreateForm,
    createFolder,
    getFolderEditForm,
    editFolder,
    shareFolder,
    getFolderFiles,
    getSharedFolderFiles,
};
