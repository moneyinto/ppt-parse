const XElement = require("./xelement");

module.exports = class PresentationXML {
    constructor(xml) {
        this.xml = XElement.init(xml);

        const lst = this.xml.getSingle("p:embeddedFontLst");
    }

    get slideSize() {
        const sldSz = this.xml.getSingle("p:sldSz");
        const w = +sldSz.attributes.cx;
        const h = +sldSz.attributes.cy;

        return { width: (w * 96) / 914400, height: (h * 96) / 914400 };
    }
};
