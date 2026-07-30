#! /usr/bin/env node
require("dotenv").config();
const { prisma } = require("../lib/prisma.js");

async function main() {
    console.log("seeding...");
    await prisma.user.create({
        data: {
            firstName: "Jhon",
            lastName: "Doe",
            username: "JhonDoe",
            hash: "123",
            salt: "123",
            iterationCount: 60000
        }
    })
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
    })
