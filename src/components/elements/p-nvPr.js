class AudioFile {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.link = node.attributes['r:link']
    }
}

class VideoFile {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.link = node.attributes['r:link']
    }
}

module.exports = class NvPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let ph = node.getSingle('p:ph')

        if (ph) {
            /**
             * @type {"body"|"ctrTitle"|"title"|"pic"|"title"|"subTitle"|"tbl"|"dt"|"chart"}
             */
            let type = ph.attributes.type
            this.placeholder = {
                idx: ph.attributes.idx,
                type,
                sz: ph.attributes.sz,
                orient: ph.attributes.orient
            }
        }

        let audioFile = node.getSingle('a:audioFile');
        if (audioFile) {
            this.audioFile = new AudioFile(audioFile);
        }

        let videoFile = node.getSingle('a:videoFile');
        if (videoFile) {
            this.videoFile = new VideoFile(videoFile);
        }
    }
}
