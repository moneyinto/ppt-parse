let xmlParser = null;
const d3 = require("d3-color");
const xml2js = require("xml2js");

try {
    xmlParser = require("../build/Release/rapidxml.node");
} catch (error) {
    console.warn(error);
    console.warn("rapidxml不存在,将使用xml2js替代");
}

/**
 * @param {*} str
 */
const parseString = (Type) => (str) => {
    /**
     * 使用c++解析会加快解析速度，并且在节点为空格的时候不会丢弃
     */
    if (xmlParser) {
        const jsonObj = xmlParser.parseString(str);
        return new Promise((r) => r(new Type(jsonObj)));
    }

    return new Promise((resolve, reject) => {
        xml2js.parseString(
            str,
            {
                attrkey: "attrs",
                childkey: "children",
                explicitChildren: true,
                preserveChildrenOrder: true,
                includeWhiteChars: true,
                normalize: false,
                // explicitCharkey:true,
                trim: false
            },
            (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const obj = res[Object.keys(res)[0]];
                    resolve(new Type(obj));
                }
            }
        );
    });
};

const applyLumColor = ({ value, lumMod, lumOff, tint, alpha }) => {
    if (!value) {
        return;
    }

    lumMod = (lumMod || 0) / 100;
    lumOff = (lumOff || 0) / 100;
    let hsl = d3.hsl("#" + value);
    if (lumOff != 0) {
        hsl.l = (hsl.l * (lumMod / 100) + (lumOff / 100)) * 100
        // hsl.l = hsl.l * (1 + lumOff);
    }

    if (tint) {
        const rgb = hsl.rgb();
        rgb.r = (rgb.r * tint) / 100 + 255 * (1 - tint / 100);
        rgb.g = (rgb.g * tint) / 100 + 255 * (1 - tint / 100);
        rgb.b = (rgb.b * tint) / 100 + 255 * (1 - tint / 100);
        hsl = d3.hsl(rgb);
    }
    let hex = hsl.hex();
    if (alpha) {
        hex = hex + Math.floor((255 * alpha) / 100).toString("16");
    }
    return hex;
};

/**
 * url 代表googlefont的地址
 * @type {{[key:string]:{url:string,name?:string}}}
 */
const GOOGLE_FONTS = {
    Corbel: {
        url: "Inconsolata"
    },
    Consolas: { url: "Roboto" },
    Calibri: { url: "Lato" },
    Muli: { url: "Muli" },
    "Muli Light": { url: "Muli:300,400", name: "Muli Light" },
    Poppins: { url: "Poppins" },
    "Poppins Light": { url: "Poppins:300,400", name: "Poppins Light" },
    "Stone Sans ITC TT-Semi": { url: "Handlee" }
};

const mapFont = (name) => {
    if (!name) {
        return undefined;
    }
    return [name, "Helvetica", "cursive"];
};

/* 生成随机码
 * @param len 随机码长度
 */
const createRandomCode = (len = 6) => {
    const charset =
        "_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const maxLen = charset.length;
    let ret = "";
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * maxLen);
        ret += charset[randomIndex];
    }
    return ret;
};

module.exports = {
    parseString,
    applyLumColor,
    GOOGLE_FONTS,
    mapFont,
    createRandomCode
};
