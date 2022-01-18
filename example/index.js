const PPT2JsonSdk = require("../src/index");
let sdk = new PPT2JsonSdk();

const path = require("path");
const fs = require("fs");

const exmaplePath = path.join(__dirname, "./");

// sdk.parsePPT(path.join(exmaplePath, "demo.pptx")).then(() => {
//     let json = JSON.stringify(sdk.json);
//     console.log(json);
// })
const init = async () => {
    const result = await sdk.parse(path.join(exmaplePath, "test3.pptx"), path.join(__dirname, "./output"));

    const filename = path.join(__dirname, "output.json");
    fs.writeFile(filename, JSON.stringify(result), () => {});
    // fs.readFile(path.join(__dirname, "./output/" + result.slides[0].blocks[0].src), (err, data) => {
    //     // console.log(err);
    // })
    // console.log(path.join(__dirname, result.slides[0].blocks[0].src));
};

init();
