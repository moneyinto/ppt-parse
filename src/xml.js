const { parseString } = require("./utils");

const PresentationXML = require("./presentation");
const SlideXML = require("./slide");
const VMLDrawing = require("./vml-drawing");
const {
    SlideRelXML,
    SlideLayoutRelXml,
    PresentationRelXML,
    MasterRelXml
} = require("./xml-rels");
const SlideLayoutXML = require("./slide-layout");
const SlideMasterXML = require("./slide-master");
const ThemeXML = require("./theme");

const parseRresentaionXML = (str) => parseString(PresentationXML)(str);

const parseSlideXML = (str) => parseString(SlideXML)(str);

const parseVmlXML = (str) => parseString(VMLDrawing)(str);

const parseSlideRelXML = (str) => parseString(SlideRelXML)(str);

const parseSlideLayoutRelXML = (str) => parseString(SlideLayoutRelXml)(str);

const parseRelsXML = (str) => parseString(PresentationRelXML)(str);

const parseMaterXml = (str) => parseString(MasterRelXml)(str);

const parseSlideLayoutXML = (str) => parseString(SlideLayoutXML)(str);

const parseSlideMaterXML = (str) => parseString(SlideMasterXML)(str);

const parseThemeXML = (str) => parseString(ThemeXML)(str);

module.exports = {
    parseRresentaionXML,
    parseSlideXML,
    parseVmlXML,
    parseSlideRelXML,
    parseSlideLayoutRelXML,
    parseRelsXML,
    parseMaterXml,
    parseSlideLayoutXML,
    parseSlideMaterXML,
    parseThemeXML
};
