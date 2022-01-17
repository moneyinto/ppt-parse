class XElement {
    constructor(xml) {
        this._attrs = xml.attrs || {};

        this.name = xml.name || xml["#name"];

        this.value = xml.value || xml._;

        this.children = (xml.children || []).map((c) => XElement.init(c));
    }

    get attributes() {
        return this._attrs;
    }

    /**
     * @param {{name:string,children:Array,attrs}} xml
     * @returns {XElement}
     */
    static init(xml) {
        if (!xml) {
            return null;
        }

        if (typeof xml === "object") {
            if (Object.keys(xml).length == 0) {
                return null;
            }
            return new XElement(xml);
        }
        return xml;
    }

    /**
     * @returns {XElement}
     */
    get(key) {
        return this.children.filter((c) => c.name == key);
        // return this._map[key]
    }

    /**
     * @returns {XElement}
     */
    getSingle(key) {
        const res = this.get(key);

        if (Array.isArray(res)) {
            return res[0];
        }

        return res;
    }

    /**
     * @param {Array<string>} arry
     * @param {any} def 默认返回值
     * @returns {XElement}
     */
    selectFirst(arry, def = undefined) {
        const tmp = this.selectArray(arry);
        return tmp[0] || def;
    }

    /**
     * @param {Array<string>} arry
     * @returns {Array<XElement>}
     */
    selectArray(arry) {
        let xml = this;
        for (let i = 0; i < arry.length; i++) {
            if (!xml) {
                break;
            }

            const key = arry[i];

            if (xml instanceof XElement) {
                xml = xml.get(key);
                continue;
            }

            if (Array.isArray(xml)) {
                xml = xml[0];
            }

            if (xml instanceof XElement) {
                xml = xml.get(key);
            } else {
                xml = null;
                break;
            }
        }

        if (!xml) {
            return [];
        } else if (Array.isArray(xml)) {
            return xml;
        } else {
            return [xml];
        }
    }

    /**
     *
     * @param {XElement} el
     * @returns {XElement}
     */
    add(el) {}
}

module.exports = XElement;
