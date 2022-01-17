const XElement = require('../../xelement')
const Xfrm = require('./a-xfrm')

const Graphic = require('./a-graphic');
const CNvPr = require('./p-cNvPr');

class NvGraphicFramePr {
    constructor(node) {
        const cNvPr = node.getSingle('p:cNvPr')
        if (cNvPr) {
            this.cNvPr = new CNvPr(cNvPr);
        }
    }
}

/**
 * This element specifies the existence of a graphics frame. This frame contains a graphic that was generated by an external source and needs a container in which to be displayed on the slide surface.
 */
module.exports = class GraphicFrame {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.tag = 'p:graphicFrame'

        let xfrm = node.getSingle('p:xfrm')

        if (xfrm) {
            this.xfrm = new Xfrm(xfrm)
        }

        let graphic = node.getSingle('a:graphic')
        if (graphic) {
            this.graphic = new Graphic(graphic)
        }

        const nvGraphicFramePr = node.getSingle('p:nvGraphicFramePr')
        if (nvGraphicFramePr) {
            this.nvGraphicFramePr = new NvGraphicFramePr(nvGraphicFramePr);
        }
    }
}