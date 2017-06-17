/*公用js文件*/
/*定义一个对象 来承载我们封装的事件*/
window.Utools = {}; /*定义了一个Utools的对象*/
//封装一个transitionEnd  过度结束事件
Utools.transitionEnd = function(dom, callback) {
        /* 需要绑定事件的dom  绑定之后  当触发了 事件的时候  执行 callback */
        if (dom && typeof dom == 'object') {
            dom.addEventListener('webkitTransitionEnd', function() {
                /*if(callback){
                    callback();
                }*/
                callback && callback();
            });
            dom.addEventListener('transitionEnd', function() {
                callback && callback();
            });
        }
    }
    /*封装tap*/
Utools.tap = function(dom, callback) {
    /*
     * 要求  没有触发 touchmove 事件
     *       并且响应速度要比click快
     */
    if (dom && typeof dom == 'object') {
        var isMove = false;
        var startTime = 0;
        dom.addEventListener('touchstart', function(e) {
            //console.log('touchstart');
            //console.time('tap');/*记录tap这个参数现在的时间*/
            startTime = Date.now();
        });
        dom.addEventListener('touchmove', function(e) {
            //console.log('touchmove');
            isMove = true;
        });
        dom.addEventListener('touchend', function(e) {
            //console.log('touchend');
            //console.timeEnd('tap')/*打印tap这个参数距离上一次记录的时候的时间*/
            /*判读  是否满足tap 的要求  一般要求tap的响应时间150*/
            if (!isMove && (Date.now() - startTime) < 150) {
                /*调用 callback*/
                callback && callback(e);
            }
            /*重置 参数*/
            isMove = false;
            startTime = 0;
        });
    }
}