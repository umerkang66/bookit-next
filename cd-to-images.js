const fs = require("fs");

const rawUrls = fs.readFileSync("./umer.txt", "utf-8");

const urls = rawUrls.split("\n");
const public_ids = urls.map((url) => {
  let public_id = "";
  let includeAble = false;

  url.split("/").forEach((chunk) => {
    if (chunk.includes("bookit")) {
      includeAble = true;
    }
    if (includeAble) {
      public_id += "/" + chunk;
    }
  });
  return public_id.replace(".jpg", "");
});

const images = urls.map((url, i) => ({ url: url, public_id: public_ids[i] }));

console.log(images);
