require("dotenv").config();

const { processAndSaveMetadataImages } = require("./image");

async function main() {
  await processAndSaveMetadataImages();
}

main()
  .catch(console.error)
  .then(() => {
    process.exit(0);
  });
