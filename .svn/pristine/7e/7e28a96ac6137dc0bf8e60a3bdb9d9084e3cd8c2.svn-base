(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    var recalc = function() {
        var width = docEl.clientWidth;

        if (width > 640) {
            width = 640;
        }
        if (width < 320) {
            width = 320;
        }

        docEl.style.fontSize = 100 * (width / 720) + 'px'; //720 是设计图的宽度  
    };
    recalc();


    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);