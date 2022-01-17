const decompress = require("decompress");
const xml = require("./xml");

// const { GOOGLE_FONTS } = require("./utils")

class PPT2JsonSdk {
    constructor() {}

    async parse(pptPath, outputPath) {
        const files = await decompress(pptPath, outputPath);

        const presentaionFile = files.find(
            (item) => item.path == "ppt/presentation.xml"
        );
        const presentationXML = await xml.parseRresentaionXML(
            presentaionFile.data.toString()
        );

        const vmls = files.filter(
            (item) => item.path.indexOf("drawings/vmlDrawing") > -1
        );

        this.vmls = [];

        for (let i = 0; i < vmls.length; i++) {
            this.vmls.push(await xml.parseVmlXML(vmls[i].data.toString()));
        }

        const slideFiles = files
            .filter((item) => /ppt\/slides\/slide[\d]+.xml$/.test(item.path))
            .sort((f1, f2) => {
                const n1 = +/\d+/.exec(f1.path)[0];
                const n2 = +/\d+/.exec(f2.path)[0];
                return n1 - n2;
            });

        this.slideXmlS = [];
        for (let i = 0; i < slideFiles.length; i++) {
            const XML = await xml.parseSlideXML(slideFiles[i].data.toString());

            const relPath =
                slideFiles[i].path.replace(
                    "slides/slide",
                    "slides/_rels/slide"
                ) + ".rels";
            const relFile = files.find((f) => f.path == relPath);
            XML.rel = await xml.parseSlideRelXML(relFile.data.toString());

            const layoutPath = XML.rel.layoutPath;
            const layoutFile = files.find((f) => f.path == layoutPath);

            XML.layout = XML.next = await xml.parseSlideLayoutXML(
                layoutFile.data.toString()
            );

            const layoutRelPath =
                layoutFile.path.replace(
                    "slideLayouts/slideLayout",
                    "slideLayouts/_rels/slideLayout"
                ) + ".rels";
            const layoutRelFile = files.find((f) => f.path == layoutRelPath);
            const layoutRel = await xml.parseSlideLayoutRelXML(
                layoutRelFile.data.toString()
            );
            XML.layout.rel = layoutRel;

            const masterPath = layoutRel.masterPath;
            const masterFile = files.find((f) => f.path == masterPath);

            if (masterFile) {
                XML.master = XML.layout.next = await xml.parseSlideMaterXML(
                    masterFile.data.toString()
                );

                const masterRelPath =
                    masterPath.replace(
                        "slideMasters/slideMaster",
                        "slideMasters/_rels/slideMaster"
                    ) + ".rels";
                const masterRelFile = files.find(
                    (f) => f.path == masterRelPath
                );
                const masterRel = await xml.parseMaterXml(
                    masterRelFile.data.toString()
                );
                const themePath = masterRel.themePath;
                const themeFile = files.find(
                    (item) => item.type == "file" && item.path == themePath
                );
                const themeXml = await xml.parseThemeXML(
                    themeFile.data.toString()
                );

                XML.master.rel = masterRel;

                XML.theme = themeXml;
            }

            XML.presentation = presentationXML;

            XML.pageIndex = i;

            XML.vmls = this.vmls;
            this.slideXmlS.push(XML);
        }

        return {
            size: presentationXML.slideSize,
            slides: this.slideXmlS.map((xml) => {
                return xml.nodes;
            })
        };
    }
}

module.exports = PPT2JsonSdk;
