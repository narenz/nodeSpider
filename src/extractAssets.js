'use strict';

exports = module.exports = ($, ele, atr) => {
    let selectors = $(ele);
    let assets = [];
    $(selectors).each((i, link) => {
        if ($(link).attr(atr))  //TO avoid empty assets
        {
            assets.push($(link).attr(atr));
        }
    });
    return assets;
}