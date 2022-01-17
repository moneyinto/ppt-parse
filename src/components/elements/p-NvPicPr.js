const CNvPr = require("./p-cNvPr");
const NvPr = require("./p-nvPr")

module.exports = class NvPicPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let nvPr = node.getSingle('p:nvPr')
        if (nvPr) {
            this.nvPr = new NvPr(nvPr);
        }

        let cNvPr = node.getSingle('p:cNvPr')
        if (cNvPr) {
            this.cNvPr = new CNvPr(cNvPr);
        }
    }
}
