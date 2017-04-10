'use strict';

exports = module.exports = ($, ele, atr) => {
    let selectors = $(ele);
    let assets = [];
    $(selectors).each((i, link) => {
        if ($(link).attr(atr))
            assets.push($(link).attr(atr));
    });
    return assets;
}