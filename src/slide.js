const XElement = require("./xelement");

const BaseSlide = require("./base-slide");

class SlideXML extends BaseSlide {
    constructor(xml) {
        super(xml);

        this.type = "slide";
    }

    get nodes() {
        const backgroundImage = this.backgroundImg || this.layout.backgroundImg || this.master.backgroundImg || "";
        const backgroundColor = this.backgroundColor || this.layout.backgroundColor || this.master.backgroundColor || { value: "#ffffff" };
        const background = backgroundImage ? { type: "image", image: backgroundImage } : { type: "solid", color: backgroundColor.value || "#ffffff" };
        const obj = {
            type: "element",
            viewportRatio: 0.5625,
            background,
            elements: []
        };

        const trans = this.transition || this.master.transition;

        if (trans) {
            obj.transition = trans;
        }

        const arry = [
            ...this.master.parseElements(),
            ...this.layout.parseElements(),
            ...this.parseElements()
        ];

        let googleFonts = Object.assign(
            {},
            this.googleFonts,
            this.layout.googleFonts,
            this.master.googleFonts
        );

        obj.elements = arry;
        // obj.googleFonts = googleFonts;

        this._json = obj;

        return obj;
    }

    get json() {}

    /**
     * @param {import('./slide-layout')} v
     */
    set layout(v) {
        this.layoutxml = v;
    }

    get layout() {
        return this.layoutxml;
    }

    /**
     * @param {XElement} node
     */
    getTextVerticalAlign(node) {
        const baseline = node.selectFirst(["a:rPr", "attrs", "baseline"]);
        if (baseline) {
            return +baseline / 1000;
        }
    }

    /**
     *
     * @param {XElement} node
     */
    getShapeFillOfNode(node) {
        const fillType = node.selectFirst(["p:spPr"]);
        if (fillType.get("a:solidFill")) {
            const color = node.selectFirst(["p:spPr", "a:solidFill"]);
            if (color.get("a:srgbClr")) {
                return color.selectFirst(["a:srgbClr", "attrs", "val"]);
            }
        }
        return undefined;
    }
}

module.exports = SlideXML;
