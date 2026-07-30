const { body, validationResult, matchedData } = require("express-validator");
const passwordUtils = require("../lib/passwordUtils.js");
const { prisma } = require("../lib/prisma.js");
const passport = require("passport");
const path = require("node:path");
const supabase = require("../lib/supabase.js");
const decodeFileName = require("../lib/decodeFilename.js");

const validateFileName = [
    body("fileName")
        .trim()
        .notEmpty()
        .withMessage(`File name must not be empty.`)
        .isLength({ min: 3, max: 50 })
        .withMessage(`File name must be between 3 and 50 characters.`)
        .custom(async (value, { req }) => {
            const parentId = req.params.folderId
                ? Number(req.params.folderId)
                : null;
            try {
                const file = await prisma.file.findFirst({
                    where: {
                        name: value,
                        folderId: parentId,
                    },
                });
                if (file) {
                    console.log(file);
                    throw new Error("File name already exists.");
                }
            } catch (err) {
                console.log(err);
                next();
            }
            return true;
        })
        .withMessage("File name already exists."),
];

async function getFileCreateForm(req, res, next) {
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
    }

    res.render("forms/uploadFile", {
        title: "Upload File",
        folderId: req.params.folderId,
    });
}

async function getFileEditForm(req, res, next) {
    const currentFile = await prisma.file.findFirst({
        where: {
            id: Number(req.params.fileId),
            userId: req.user.id,
        },
    });

    if (!currentFile) {
        return res.render("errorPages/errorPage", {
            errorMessage: "That file does not exist in your storage!"
        })
    }

    res.render("forms/editFile", {
        title: "Edit File",
        currentName: currentFile.name,
        folderId: req.params.folderId,
        fileId: req.params.fileId,
    });
}

const editFile = [
    validateFileName,
    async (req, res, next) => {
        const { fileName } = req.body;

        const { fileId: paramFileId, folderId: paramFolderId } = req.params;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render(`forms/editFile`, {
                title: "Edit File",
                errors: errors.array(),
                currentName: fileName,
                folderId: paramFolderId,
                fileId: paramFileId,
            });
        }

        if (!paramFileId || paramFileId == 0) {
            return res.redirect("/");
        }

        try {
            const updatedFile = await prisma.file.update({
                data: {
                    name: fileName,
                },
                where: {
                    id: Number(paramFileId),
                    userId: req.user.id,
                },
            });
            if (!updatedFile) {
                return res.render("errorPages/errorPage", {
                    errorMessage: "That folder does not exist in your storage!"
                })
            }
            if (paramFolderId == 0) {
                return res.redirect("/")
            }
            return res.redirect(`/folder/${paramFolderId}`);
        } catch (err) {
            return next(err);
        }
    },
];

const uploadFile = [
    validateFileName,
    async function (req, res, next) {
        if (!req.files || req.files.length == 0) {
            throw new Error("You must select a file to upload.");
        }

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
        }

        const { fileName } = req.body;

        try {
            await Promise.all(
                req.files.map(async (file) => {
                    const ext = path.extname(file.originalname);
                    const storageName = `${Date.now()}-${crypto.randomUUID()}${ext}`;

                    if (file.size > 53687091200) {
                        //50 MB
                        throw new Error("File cannot exceed 50 MB.");
                    }

                    const uploadFileName = decodeFileName(
                        fileName?.trim() || file.originalname,
                    );
                    const mimeTypeBucket = file.mimetype.split("/")[0];
                    const { data, error } = await supabase.storage
                        .from(`${mimeTypeBucket}-bucket`)
                        .upload(storageName, file.buffer, {
                            contentType: file.mimetype,
                        });
                    if (error) {
                        throw error;
                    }
                    return await prisma.file.create({
                        data: {
                            name: uploadFileName,
                            url: data.path,
                            mimeType: file.mimetype,
                            size: file.size,
                            userId: req.user?.id,
                            storageName: storageName,
                            ...(req.params.folderId &&
                                req.params.folderId != 0 && {
                                    folderId: Number(req.params.folderId),
                                }),
                        },
                    });
                }),
            );
        } catch (err) {
            console.log(err);
            next(err);
        }
        if (
            Number.isInteger(Number(req.params.folderId)) &&
            Number(req.params.folderId) !== 0
        ) {
            return res.redirect(`/folder/${req.params.folderId}`);
        }

        return res.redirect("/");
    },
];

async function downloadFile(req, res, next) {
    if (!Number.isInteger(Number(req.params.fileId))) {
        return next();
    }

    try {
        const file = await prisma.file.findUnique({
            where: {
                id: Number(req.params.fileId),
            },
            include: {
                folder: {
                    include: {
                        shares: true,
                    }
                }
            }
        });

        if (!file || (file.userId !== req.user.id && (!file.folder?.shares || file.folder?.shares.length !== 0))) {
            return res.render("errorPages/errorPage", {
                errorMessage: "That file does not exist in your storage!"
            })
        }

        console.log(file)
        console.log(req.user.id)
        console.log(file.folder?.shares)
        console.log(file.folder?.shares.length);

        const mimeTypeBucket = file.mimeType.split("/")[0];
        const { data } = await supabase.storage
            .from(`${mimeTypeBucket}-bucket`)
            .createSignedUrl(file.storageName, 60);

        return res.redirect(data.signedUrl);
    } catch (err) {
        console.log(err);
        return next(err);
    }
}

module.exports = {
    getFileCreateForm,
    uploadFile,
    getFileEditForm,
    editFile,
    downloadFile,
};
