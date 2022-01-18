const XElement = require("./xelement");

const TextStyles = require("./components/text-styles");

const SlideBg = require("./components/elements/p-bg");

const Transition = require("./components/elements/p-transition");

const ShapeTree = require("./components/ShapeTree");

const Sp = require("./components/elements/p-sp");
const Pic = require("./components/elements/p-pic");
const GroupSp = require("./components/elements/p-grpSp");
const GraphicFrame = require("./components/elements/p-graphicFrame");

const Color = require("./components/elements/c-color");

const GradFill = require("./components/elements/a-gradFill");

const { mapFont, applyLumColor, GOOGLE_FONTS, createRandomCode } = require("./utils");

const SlideFunctions = require("./components/slide-functions");
const { SHAPE_LIST } = require("./shape");

module.exports = class BaseSlide {
    constructor(xml) {
        this.xml = XElement.init(xml);

        const spTree = this.xml.selectFirst(["p:cSld", "p:spTree"]);

        this.elements = spTree.children
            .map((el) => ShapeTree.createElement(el))
            .filter((e) => !!e);

        this.placeholders = this.elements.filter((sp) => !!sp.placeholder);

        this.viewElements = this.elements.filter((sp) => !sp.placeholder);

        const bg = this.xml.selectFirst(["p:cSld", "p:bg"]);

        if (bg) {
            this.bg = new SlideBg(bg);
        }

        const trans = this.xml.getSingle("p:transition");
        if (trans) {
            this.transition = new Transition(trans);
        }

        this.googleFonts = {};

        /**
         * @type {"slide"|"layout"|"master"}
         */
        this.type = "";
    }

    get backgroundImg() {
        if (this.bg && this.bg.imageEmbed) {
            return this.rel.getRelationById(this.bg.imageEmbed);
        }
    }

    get backgroundColor() {
        const color = {};

        if (this.bg && this.bg.bgRef) {
            const phClr = this.bg.bgRef.value;
            const fill = this.theme.getBgFillByIdx(this.bg.bgRef.idx);
            if (fill) {
                if (phClr) {
                    if (fill instanceof GradFill) {
                        fill.list.map((g) => {
                            g.value = g.value == "phClr" ? phClr : g.value;
                        });
                    } else {
                        fill.value = phClr;
                    }
                }

                color.type = fill.fillType;
                color.value = fill;
                color.ang = fill.ang;
            }
        }

        if (!color.type && this.bg && this.bg.color) {
            color.type = this.bg.color.fillType;
            color.value = this.bg.color;
            color.ang = this.bg.color.ang;
        }

        if (color.type) {
            if (color.type == "grad") {
                color.value = this.getGradFill(color.value);
            } else if (color.type == "solid") {
                color.value = this.getSolidFill(color.value);
            } else {
                return null;
            }
            color.value = "#" + (color.value.length === 8 ? color.value.substr(2, 7) + color.value.substr(0, 2) : color.value);
            return color;
        }
    }

    /**
     * @param {import('./presentation')} v
     */
    set presentation(v) {
        this._presationXML = v;
        if (this.next) {
            this.next.presentation = v;
        }
    }

    get presentation() {
        return this._presationXML;
    }

    set pageIndex(v) {
        this._pageIndex = v;
        if (this.next) {
            this.next.pageIndex = v;
        }
    }

    /**
     * @param {Array<import("./vml-drawing")>} v
     */
    set vmls(v) {
        this._vmls = v;
        if (this.next) {
            this.next.vmls = v;
        }
    }

    /**
     * @param {import('./theme')} v
     */
    set theme(v) {
        this._theme = v;

        if (this.next) {
            this.next.theme = this.theme;
        }
    }

    get theme() {
        return this._theme;
    }

    /**
     * @param {import('./xml-rels')} v
     */
    set rel(v) {
        this.relxml = v;
    }

    get rel() {
        return this.relxml;
    }

    parseElements() {
        let elements = this.elements;
        if (this.type != "slide") {
            elements = this.viewElements;
        }
        return this._parseElements(elements, true);
    }

    _parseElements(elements, _top = false) {
        const allElements = elements
            .map((sp) => {
                if (sp.tag == "p:sp") {
                    return this.parseSp(sp);
                } else if (sp.tag == "p:pic") {
                    return this.parsePic(sp);
                } else if (sp.tag == "p:grpSp") {
                    return this.parseGrp(sp);
                } else if (sp.tag == "p:graphicFrame") {
                    return this.parseGraphic(sp);
                }
            })
            .filter((i) => !!i);
        let resultElements = [];
        allElements.map(el => {
            if (el.type !== "group") {
                resultElements.push(el);
            } else {
                const grpElements = this.reSizeGroup(el);
                resultElements = resultElements.concat(grpElements);
            }
        })
        return resultElements;
    }

    /**
     * @param {BaseSlide} v
     */
    set next(v) {
        this._next = v;
    }

    get next() {
        return this._next;
    }

    /**
     * @param {import('./slide-master')} v
     */
    set master(v) {
        this.materxml = v;

        if (this.next) {
            this.next.master = v;
        }
    }

    get master() {
        return this.materxml;
    }

    /**
     * @param {Sp} sp
     */
    parseTxBody(sp, isShape, isTitleOrContent) {
        if (!sp.txBody) {
            return;
        }
        const text = sp.txBody.pList
            .map((p) => {
                let defRpr = SlideFunctions.getDefRPr(sp, p.lvl)(this) || {};
                let ppr = SlideFunctions.getPPr(sp, p.pPr, p.lvl)(this) || {};
                if (defRpr.solidFill) {
                    defRpr.color = this.getSolidFill(defRpr.solidFill);
                    delete defRpr.solidFill;
                }
                const container = {
                    children: p.rList
                        .map((r) => {
                            if (!r.text || r.text.length == "0") {
                                return;
                            }

                            let fontFamily = r.fontFamlily || defRpr.typeface;
                            if (fontFamily && fontFamily.indexOf("+") == 0) {
                                fontFamily =
                                    this.theme.fontScheme.getFont(fontFamily);
                            }

                            if (fontFamily && GOOGLE_FONTS[fontFamily]) {
                                const googleFont = GOOGLE_FONTS[fontFamily];
                                fontFamily = googleFont.name || googleFont.url;
                                this.googleFonts[googleFont.url] = true;
                            }
                            fontFamily = mapFont(fontFamily);

                            let color = this.getSolidFill(r.solidFill);

                            if (r.rPr && r.rPr.link) {
                                color =
                                    this.getSolidFill({
                                        type: "schemeClr",
                                        value: "hlink"
                                    }) || color;
                            }

                            const json = {
                                type: "span",
                                value: r.text,
                                bold: r.rPr && r.rPr.bold,
                                italic: r.rPr && r.rPr.italic,
                                underline: r.rPr && r.rPr.underline,
                                strike: r.rPr && r.rPr.strike,
                                link: r.rPr && r.rPr.link
                                // valign:this.getTextVerticalAlign(r),
                            };

                            json.size = r.fontSize || defRpr.size;

                            if (r.rPr && r.rPr.baseline) {
                                json.baseline = r.rPr.baseline;
                                if (json.size) {
                                    json.size =
                                        (json.size * (100 - json.baseline)) /
                                        100;
                                }
                            }

                            if (
                                r.rPr &&
                                r.rPr.effectLst &&
                                r.rPr.effectLst.outerShaw
                            ) {
                                const shaw = r.rPr.effectLst.outerShaw;
                                json.outerShadow = {
                                    color: this.getSolidFill(shaw),
                                    direction: shaw.dir,
                                    blurRad: shaw.blurRad,
                                    dist: shaw.dist
                                };
                            }

                            if (fontFamily) {
                                json.fontFamily = fontFamily;
                            }

                            if (color) {
                                json.color = color;
                            }

                            if (r.rPr && r.rPr.highlight) {
                                json.highlight = this.getSolidFill(
                                    r.rPr.highlight
                                );
                            }

                            return json;
                        })
                        .filter((t) => t)
                };
                if (!p.bullNone) {
                    if (
                        sp.type == "body" ||
                        (p.hasBullet && sp.type != "body")
                    ) {
                        let bullet = SlideFunctions.getBullet(
                            sp,
                            p.bullet,
                            p.lvl
                        )(this);
                        if (bullet) {
                            container.bullet = bullet;
                        }
                    }
                }
                if (
                    container.children.length == 0 &&
                    sp.txBody.pList.length != 1
                ) {
                    container.children.push({ value: "\n" });
                    container.bullet = null;
                }
                if (sp.type != "sldNum" && container.children.length == 0) {
                    return;
                }
                Object.assign(container, ppr, defRpr);
                if (sp.type == "sldNum" && p.isSlideNum) {
                    container.isSlideNum = true;
                }
                return container;
            })
            .filter((i) => !!i);
        let content = "";
        text.map(lineText => {
            lineText.children.map(s => {
                let innerContent = "";
                if (s.type === "span") {
                    innerContent = "<span style=\"" + (s.color ? "color:#" + s.color + ";" : isShape && !isTitleOrContent ? "color:#ffffff;" : "color:#000000;") + (s.size ? "font-size:" + Math.round(s.size) + "px" + ";" : "") + (s.fontFamily ? "font-family:" + s.fontFamily[0] + ";" : "") + "\">" + s.value + "</span>";
                    if (s.bold) {
                        innerContent = "<strong>" + innerContent + "</strong>";
                    }
                    if (s.italic) {
                        innerContent = "<em>" + innerContent + "</em>";
                    }
                }
                content = content + innerContent;
            });
            const align = {"ctr": "center", "l": "left", "r": "right"}[lineText.algn] || "";
            content = "<p style=\"" + (align ? "text-align:" + align : "") + "\">" + content + "</p>";
        });
        const result = {
            content,
            defaultFontName: "微软雅黑",
            defaultColor: "#000",
            defaultFontSize: "18px"
        };
        return result;
    }

    /**
     * @param {Sp} sp
     * @returns {{type:"container",size:{width,height},position:{x,y}}}
     */
    parseSp(sp) {
        const txBodyPr = SlideFunctions.getTxBodyPr(sp)(this);
        // sp.nvSpPr.txBox 区分 文本框 和 形状
        const isShape = !sp.nvSpPr.txBox;
        const { id, name } = sp.nvSpPr.cNvPr;
        let isTitleOrContent = false;      
        if (sp.nvSpPr.nvPr && sp.nvSpPr.nvPr.placeholder && ["body", "ctrTitle", "title", "subTitle", "pic", "tbl", "dt", "chart"].indexOf(sp.nvSpPr.nvPr.placeholder.type) > -1 || name.indexOf("占位符") > -1) {
            // 标题 副标题 内容直接解析为形状
            // 标题居下
            // 内容居上
            isTitleOrContent = true;
        }
        const randID = createRandomCode();
        let container = {
            id: id || randID,
            name: name || ((isShape ? "形状-" : "文本-") + randID),
            type: isShape ? "shape" : "text",
            ...isShape ? { fixedRatio: false } : {}
        };

        const xfrm = SlideFunctions.getXfrm(sp)(this);

        if (xfrm) {
            container.left = xfrm.off.x;
            container.top = xfrm.off.y;
            container.width = xfrm.ext.cx;
            container.height = xfrm.ext.cy;
            container.rotate = xfrm.rot || 0;
        }

        if (sp.custGeom) {
            // 待观察。。
            container.svgs = sp.custGeom.paths;
        }

        const fill = SlideFunctions.getFill(sp)(this);
        if (fill) {
            container.fill = "#" + this.getSolidFill(fill.value);
            // if (fill.type == "grad") {
            //     container.fill = {
            //         type: fill.type,
            //         value: this.getGradFill(fill.value)
            //     };
            // } else {
            //     container.fill = {
            //         type: fill.type,
            //         value: this.getSolidFill(fill.value)
            //     };
            // }
        } else {
            container.fill = "#ffffff00";
        }

        const line = SlideFunctions.getLine(sp)(this);
        if (line && line.color) {
            const type = line.prstDash;
            container.outline = {
                color: "#" + this.getSolidFill(line.color),
                // round: line.round,
                style: type ? type.toLocaleLowerCase().indexOf("dash") ? "dashed" : "solid" : "solid",
                width: line.width || 1
            };
        }

        // const color = this.getSolidFill(SlideFunctions.getTextColor(sp)(this));
        // if (color) {
        //     container.fill = "#" + color;
        // }

        const prstShape = SlideFunctions.getPrstGeom(sp)(this);
        if (prstShape && isShape) {
            // container.prstShape = prstShape;
            if (["straightConnector1", "line", "curvedConnector3", "bentConnector3"].indexOf(prstShape.type) === -1) {
                container.path = SHAPE_LIST[prstShape.type] ? SHAPE_LIST[prstShape.type].path : SHAPE_LIST["rect"].path;
                container.viewBox = SHAPE_LIST[prstShape.type] ? SHAPE_LIST[prstShape.type].viewBox : SHAPE_LIST["rect"].viewBox;
            } else {
                container.type = "line";
                const ln = sp.spPr.ln;
                container.points = [ln && ln.headEnd || "", ln && ln.tailEnd || ""];
                container.start = [0, 0];
                container.end = [container.width || 0, container.height || 0];
                const outline = container.outline;
                if (xfrm) {
                    if (xfrm.flipH) {
                        container.start[0] = container.width || 0;
                        container.end[0] = 0;
                    }

                    if (xfrm.flipV) {
                        container.start[1] = container.height || 0;
                        container.end[1] = 0;
                    }
                }
                container.color = outline && outline.color || "#5b9bd5";
                container.style = ln && ln.prstDash ? ln.prstDash.toLocaleLowerCase().indexOf("dash") ? "dashed" : "solid" : "solid";
                container.width = outline && outline.width || 1;
                delete container.height;
                delete container.fixedRatio;
                delete container.rotate;
                delete container.fill;
                delete container.outline;
            }
        }

        const text = this.parseTxBody(sp, isShape, isTitleOrContent);

        if (text) {
            if (isShape) {
                const titleAndContentAlign = {
                    ctrTitle: "bottom",
                    subTitle: "top",
                    body: "top",
                    title: "bottom"
                };
                const defaultAlign = (isTitleOrContent ? (titleAndContentAlign[sp.nvSpPr.nvPr.placeholder && sp.nvSpPr.nvPr.placeholder.type ? sp.nvSpPr.nvPr.placeholder.type : "body"] || "top") : "middle")
                container.text = { ...text, align: sp.txBody.bodyPr ? sp.txBody.bodyPr.anchor === "center" ? "middle" : sp.txBody.bodyPr.anchor : defaultAlign };
            } else {
                container = {
                    ...container,
                    ...text
                }
            }
        }

        // 暂不支持任意多边形 以矩形代替
        if (container.svgs) {
            delete container.svgs;
            container.path = SHAPE_LIST["rect"].path;
            container.viewBox = SHAPE_LIST["rect"].viewBox;
        }

        return container;
    }

    /**
     * @param {Pic} pic
     * @returns {{type:"image",size:{width,height},position:{x,y}}}
     */
    parsePic(pic) {
        const { audioFile, videoFile } = pic.nvPicPr.nvPr;
        if (audioFile) {
            return this.parseAudio(pic);
        }
        if (videoFile) {
            return this.parseVideo(pic);
        }
        const { id, name } = pic.nvPicPr.cNvPr;
        const randID = createRandomCode();
        const item = {
            id: id || randID,
            name: name || ("图片-" + randID),
            fixedRatio: false,
            src: this.rel.getRelationById(pic.embed),
            type: "image",
            stretch: 1
        };

        const xfrm = pic.spPr && pic.spPr.xfrm;
        if (xfrm) {
            item.left = xfrm.off.x;
            item.top = xfrm.off.y;
            item.width = xfrm.ext.cx;
            item.height = xfrm.ext.cy;
            item.rotate = xfrm.rot || 0;
        }

        return item;
    }

    parseAudio(audio) {
        const { audioFile } = audio.nvPicPr.nvPr;
        const { id, name } = audio.nvPicPr.cNvPr;
        const randID = createRandomCode();
        const item = {
            id: id || randID,
            name: name || ("音频-" + randID),
            src: this.rel.getRelationById(audioFile.link),
            icon: this.rel.getRelationById(audio.embed),
            type: "audio"
        };

        const xfrm = audio.spPr && audio.spPr.xfrm;
        if (xfrm) {
            item.left = xfrm.off.x;
            item.top = xfrm.off.y;
            item.width = xfrm.ext.cx;
            item.height = xfrm.ext.cy;
            item.rotate = xfrm.rot || 0;
        }

        return item;
    }

    parseVideo(video) {
        const { videoFile } = video.nvPicPr.nvPr;
        const { id, name } = video.nvPicPr.cNvPr;
        const randID = createRandomCode();
        const item = {
            id: id || randID,
            name: name || ("视频-" + randID),
            src: this.rel.getRelationById(videoFile.link),
            poster: this.rel.getRelationById(video.embed),
            type: "video",
            showType: 0
        };

        const xfrm = video.spPr && video.spPr.xfrm;
        if (xfrm) {
            item.left = xfrm.off.x;
            item.top = xfrm.off.y;
            item.width = xfrm.ext.cx;
            item.height = xfrm.ext.cy;
            item.rotate = xfrm.rot || 0;
        }

        return item;
    }

    /**
     * @param {GroupSp} gp
     */
    parseGrp(gp) {
        const container = {
            children: this._parseElements(gp.elements),
            type: "group"
        };

        if (gp.xfrm) {
            container.position = gp.xfrm.off;
            container.size = {
                width: gp.xfrm.ext.cx,
                height: gp.xfrm.ext.cy
            };
            if (gp.xfrm.rot) {
                container.rot = gp.xfrm.rot;
            }
            if (gp.xfrm.chOff) {
                container.chOff = gp.xfrm.chOff;
            }
            if (gp.xfrm.chExt) {
                container.chExt = gp.xfrm.chExt;
            }
        }

        return container;
    }

    /**
     *
     * @param {*} sp
     * @param {*} ox 子偏移
     * @param {*} oy 子偏移
     * @param {*} scaleX
     * @param {*} scaleY
     */
    reSizeSp(sp, ox, oy, scaleX, scaleY, left, top) {
        const rx = (sp.left - ox) * scaleX;
        const ry = (sp.top - oy) * scaleY;
        const rw = sp.width * scaleY;
        const rh = sp.height * scaleY;
        const groupElements = [];
        if (sp.type == "group") {
            scaleX = rw / sp.chExt.width;
            scaleY = rh / sp.chExt.height;
            sp.children.map((s) => {
                groupElements = groupElements.concat(this.reSizeSp(s, sp.chOff.x, sp.chOff.y, scaleX, scaleY, sp.position.x, sp.position.y));
            });
            return groupElements;
        } else {
            sp.left = rx + left;
            sp.top = ry + top;
            sp.width = rw;
            sp.height = rh;
            return [sp];
        }
    }

    reSizeGroup(grp) {
        const scaleX = grp.size.width / grp.chExt.width;
        const scaleY = grp.size.height / grp.chExt.height;
        const groupId = createRandomCode();
        let groupElements = [];
        grp.children = grp.children.map((sp) => {
            groupElements = groupElements.concat(this.reSizeSp(sp, grp.chOff.x, grp.chOff.y, scaleX, scaleY, grp.position.x, grp.position.y));
        });
        return groupElements.map(el => {
            return {
                ...el,
                groupId
            }
        });
    }

    /**
     *
     * @param {GraphicFrame} frame
     */
    parseGraphic(frame) {
        const item = {
            type: frame.graphic.type
        };

        if (frame.xfrm) {
            item.left = frame.xfrm.off.x;
            item.top = frame.xfrm.off.y;
            item.width = frame.xfrm.ext.cx;
            item.height = frame.xfrm.ext.cy;
            if (frame.xfrm.rot) {
                item.rotate = frame.xfrm.rot;
            }
        }

        if (item.type == "table") {
            const table = frame.graphic.table;
            const colWidths = table.gridCols.map(w => { return w / item.width });
            item.colWidths = colWidths;
            const { id, name } = frame.nvGraphicFramePr.cNvPr;
            const randID = createRandomCode();
            item.id = id || randID;
            item.name = name || ("表格-" + id);
            item.rowHeights = [];
            item.outline = {};
            item.data = table.trs.map((tr) => {
                item.rowHeights.push(tr.height / item.height);
                return tr.tcs.map((tc) => {
                    const text = this.parseTxBody(tc);
                    const style = {
                        color: text ? text.defaultColor : "#000",
                        fontname: text ? text.defaultFontName : "Microsoft Yahei",
                        fontsize: text ? text.defaultFontSize : "18px"
                    }
                    if (text) style.backcolor = "#" + this.getSolidFill(tc.tcPr.solidFill)
                    const content = {
                        text: text ? text.content : "",
                        style,
                        ln: tc.tcPr && tc.tcPr.ln,
                        id: createRandomCode(),
                        colspan: Number(tc.gridSpan || "1"),
                        rowspan: Number(tc.rowSpan || "1")
                    };
                    if (content.ln && content.ln.color) {
                        content.ln.color = this.getSolidFill(
                            content.ln.color
                        );
                    }
                    return content;
                })
            });
            // item.table = {
            //     cols: table.gridCols,
            //     trs: table.trs.map((tr) => {
            //         return {
            //             tcs: tr.tcs.map((tc) => {
            //                 const content = {
            //                     body: this.parseTxBody(tc),
            //                     ln: tc.tcPr && tc.tcPr.ln
            //                 };
            //                 if (content.ln && content.ln.color) {
            //                     content.ln.color = this.getSolidFill(
            //                         content.ln.color
            //                     );
            //                 }
            //                 return content;
            //             }),
            //             height: tr.height
            //         };
            //     })
            // };
        } else if (item.type == "oleObj") {
            const oleObj = frame.graphic.oleObj;
            if (oleObj && oleObj.spid) {
                const vml = this._vmls.find((vml) => vml.spid == oleObj.spid);
                if (vml) {
                    item.src = vml.src;
                    item.width = vml.width;
                    item.height = vml.height;
                    item.left = vml.left;
                    item.top = vml.top;
                    item.imgW = oleObj.imgW;
                    item.imgH = oleObj.imgH;
                }
            }
        }

        return item;
    }

    /**
     *
     * @param {Color} solid
     */
    getSolidFill(solid) {
        if (!solid) {
            return;
        }
        let res = solid;
        if (solid.toJSON) {
            res = solid.toJSON();
        }
        if (solid.type == "schemeClr") {
            if (solid.value == "phClr") {
                res.value = "000";
            } else {
                const k = this.theme.getColor(
                    "a:" + this.master.findSchemeClr(solid.value)
                );
                if (k) {
                    res.value = k;
                }
            }
        }
        return applyLumColor(res);
    }

    /**
     *
     * @param {GradFill} grad
     */
    getGradFill(grad) {
        if (!grad) {
            return;
        }
        return grad.list
            .map((c) => {
                const color = this.getSolidFill(c);
                if (!color) {
                    return {};
                }
                return { pos: c.pos, value: color };
            })
            .filter((c) => !!c.value);
    }

    /**
     * @returns {Sp}
     * @param {{type,idx}} params
     */
    getPlaceholder(params) {
        if (!params.idx && !params.type) {
            return;
        }

        let finded = this.placeholders.find((sp) => sp.type == params.type);

        if (params.idx) {
            finded =
                this.placeholders.find((sp) => sp.idx == params.idx) || finded;
        }

        if (finded) {
            if (!params.type) {
                params.type = finded.type;
            }
            // params.idx = finded.idx || params.idx
        }

        return finded;
    }

    getTitleColor() {
        if (this.type != "master") {
            return this.master.getTitleColor();
        }
    }

    /**
     * @param {{type,idx}} params
     */
    getTxStyle(params) {
        const finded = this.getPlaceholder(params);
        return finded && finded.txBody && finded.txBody.textStyle;
    }
};
