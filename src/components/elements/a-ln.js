const XElement = require('../../xelement')

const SolidFill = require('./a-solidFill')

const { EMU2PIX } = require('../measure')

/**
 * This element specifies an outline style that can be applied to a number of different objects such as shapes and text. The line allows for the specifying of many different types of outlines including even line dashes and bevels.
 */
module.exports = class Ln {
    /**
    * @param {XElement} node
    */
    constructor(node) {
        /**
         * The weight of the line is specified by the w attribute of the <a:ln> element. Values are in EMUs. 1pt = 12700 EMUs. If the attribute is omitted, then a value of 0 is assumed.
         */
        const w = node.attributes.w

        if (w) {
            /**
             * Specifies the width to be used for the underline stroke. If this attribute is omitted, then a value of 0 is assumed.
             */
            this.width = EMU2PIX(w)
        }

        const solidFill = node.getSingle('a:solidFill')

        if (solidFill) {
            this.solidFill = new SolidFill(solidFill)
        }

        /**
         * This element specifies that lines joined together will have a round join.
         */
        this.round = !!node.getSingle('a:round')

        const prstDash = node.getSingle('a:prstDash')

        if (prstDash) {
            /**
             * This element specifies that a preset line dashing scheme should be used.
             */
            this.prstDash = prstDash.attributes.val || 'solid'
        }

        const tailEnd = node.getSingle('a:tailEnd')
        if (tailEnd) {
            this.tailEnd = tailEnd.attributes.type || ""
        }

        const headEnd = node.getSingle('a:headEnd')
        if (headEnd) {
            this.headEnd = headEnd.attributes.type || ""
        }
    }

    get exsist() {
        return this.width || this.solidFill || this.prstDash
    }

    toJSON() {
        return {
            width: this.width,
            color: this.solidFill,
            prstDash: this.prstDash,
            tailEnd: this.tailEnd,
            headEnd: this.headEnd
        }
    }
}
