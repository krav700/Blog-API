// const { prisma } = require("../lib/prisma.js");

require("dotenv").config();
const { prisma } = require("../lib/prisma.js");

async function main() {
    const users = await prisma.user.findMany()
    console.log(users);
}

main()
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
