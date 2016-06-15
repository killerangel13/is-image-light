/*
 * # is-image-light - 0.0.1
 *
 * Copyright 2016 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
(function() {
    window.is_image_light = o => !o.img.naturalHeight ?
        
        o.img.addEventListener("load", _ => is_image_light(o), false):

        is_image_light(o);

    function is_image_light(o) {

        var img = o.img,

        o = ext({
            // between 0 & 1
            downsample: 0.1,
            threshold: 0.555,

            // CSS dimensions
            top: 0,
            left: "0.0%",
            bottom: 0,
            right: "0px",

            next: boolean => {}
        }, o),

        xywh = position(o, img),

        can = document.createElement("canvas"),
        ctx = can.getContext("2d"),

        grayscales = {

            // https://www.itu.int/rec/R-REC-BT.709-1-199311-S/en
            r: 0.2125,
            g: 0.7154,
            b: 0.0721
        };

        can.width = Math.max(1, Math.round(xywh.w * o.downsample));
        can.height = Math.max(1, Math.round(xywh.h * o.downsample));

        ctx.drawImage(img, xywh.x, xywh.y, xywh.w, xywh.h, 0, 0, can.width, can.height);

        let pix = ctx
            .getImageData(0, 0, can.width, can.height)
            .data,

        len = pix.length,
        num = ~~(len/4),
        avg = 0;

        for(let i = 0; i < len; i += 4) avg+=((
            (grayscales.r * pix[i])+
            (grayscales.g * pix[i + 1])+
            (grayscales.b * pix[i + 2])
        )/255);

        avg /= num;

        o.next(avg > o.threshold);
    }

    function position(css, img) {

        let box = {
            top: img.naturalHeight,
            left: img.naturalWidth,
            bottom: img.naturalHeight,
            right: img.naturalWidth
        },

        scaled = {},

        scale = (number, dim) => typeof number !== "string" ?
            
            number : parseFloat(number) * (

                number.indexOf("%") > -1 ? (box[dim]/100) : 1
        );

        for(let dim in box)
            scaled[dim] = scale(css[dim], dim);

        return {

            x: scaled.left,
            y: scaled.top,
            w: box.right - scaled.right - scaled.left,
            h: box.bottom - scaled.bottom - scaled.top
        };
    }
    function ext(sub, sup) {
        
        for(let k in sup)
            sub[k] = sup[k];

        return sub;
    }
})();