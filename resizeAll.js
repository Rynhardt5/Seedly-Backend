const fs = require("fs");
const sharp = require("sharp");

async function compressImagesInDir(path) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    console.log("file", `./${path}/${dirent.name}`);
    if (!/^\..*/.test(dirent.name)) {
      await sharp(`./${path}/${dirent.name}`)
        .resize({ width: 640, height: 360 })
        .jpeg({ quality: 80 })
        .toFile(`./${path}/Y_${dirent.name}`);
    }

    console.log(dirent.name);
  }
}

compressImagesInDir("uploads").catch(console.error);
