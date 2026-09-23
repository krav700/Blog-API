require("dotenv").config();
const { prisma } = require("../lib/prisma.js");

async function main() {
    console.log("deleting...");
    await prisma.comment.deleteMany({});
    await prisma.blogPost.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("done");
}

main()
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
