function decodeFilename(filename) {
    const mojibakePattern = /Ã.|Â.|Ð.|Ñ.|�/;
    if (mojibakePattern.test(filename)) {
        return Buffer.from(filename, "latin1").toString("utf8");
    }

    return filename;
}

module.exports = decodeFilename;