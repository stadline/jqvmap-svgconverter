var xmldoc = require('xmldoc');
var svgflatten = require('svg-flatten');

module.exports = {
    convertString: function (svg) {
        return this.convertDom(new xmldoc.XmlDocument(svg));
    },

    convertDom: function (_dom) {
        // parse and flatten source svg
        var dom = svgflatten(_dom)
          .pathify()
          .flatten()
          .transform()
          .value();

        // build vmap options
        var vmapWidth, vmapHeight;

        if (dom.attr.width && dom.attr.height) {
            vmapWidth = parseInt(dom.attr.width, 10);
            vmapHeight = parseInt(dom.attr.height, 10);
        } else if (dom.attr.viewBox) {
            vmapWidth = Math.ceil(dom.attr.viewBox.split(" ")[2]);
            vmapHeight = Math.ceil(dom.attr.viewBox.split(" ")[3]);
        } else {
            console.log(dom);
            throw new Error("Cannot handle this dom element");
        }

        var vmapPaths = {};
        dom.children.forEach(function (path, i) {
            if (path.name !== "path" || !path.attr.d) {
                return;
            }
            var key = path.attr.id ? path.attr.id : "_path" + i;
            vmapPaths[key] = {
                path: path.attr.d,
                name: path.attr.title || null,
                class: path.attr.class || null
            };
        });

        // return vmap options
        return {
            width: vmapWidth,
            height: vmapHeight,
            paths: vmapPaths
        };
    }
};