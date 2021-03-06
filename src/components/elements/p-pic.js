const SpPr = require('./p-spPr')

const XElement = require('../../xelement')

const BlipFill = require('./p-blipFill')
const NvPicPr = require('./p-NvPicPr')

module.exports = class Pic {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.tag = 'p:pic'

        let spPr = node.selectFirst(['p:spPr'])
        if (spPr) {
            this.spPr = new SpPr(spPr)
        }

        let blipFill = node.getSingle('p:blipFill')
        if (blipFill) {
            this.blipFill = new BlipFill(blipFill)
        }

        let nvPicPr = node.getSingle('p:nvPicPr')
        if (nvPicPr) {
            this.nvPicPr = new NvPicPr(nvPicPr)
        }
    }

    get embed() {
        if (this.blipFill) {
            return this.blipFill.embed
        }
    }

    get src() {
        return this._src
    }

    set src(v) {
        this._src = v
    }
}
