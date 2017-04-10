'use strict';

exports = module.exports = ($, ele, atr, suffix) => {
    let selectors = $(ele);
    let assets = [];
    $(selectors).each((i, link) => {
        if ((suffix && $(link).attr(atr).endsWith(suffix)) || (!suffix && $(link).attr(atr)))  //TO avoid empty assets
        {
            assets.push($(link).attr(atr));
        }
    });
    return assets;
}