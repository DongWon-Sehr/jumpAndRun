function getWindowFrameRate(callback, runIndefinitely) {
    let requestId = null;
    let callbackTriggered = false;
    runIndefinitely = runIndefinitely || false;

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    }

    let DOMHighResTimeStampCollection = [];

    let triggerAnimation = function (DOMHighResTimeStamp) {
        DOMHighResTimeStampCollection.unshift(DOMHighResTimeStamp);

        if (DOMHighResTimeStampCollection.length > 10) {
            let t0 = DOMHighResTimeStampCollection.pop();
            let fps = Math.floor(1000 * 10 / (DOMHighResTimeStamp - t0));

            if (!callbackTriggered) {
                callback.call(undefined, fps, DOMHighResTimeStampCollection);
            }

            if (runIndefinitely) {
                callbackTriggered = false;
            } else {
                callbackTriggered = true;
            }
        }

        requestId = window.requestAnimationFrame(triggerAnimation);
    };

    window.requestAnimationFrame(triggerAnimation);

    // Stop after half second if it shouldn't run indefinitely
    if (!runIndefinitely) {
        window.setTimeout(function () {
            window.cancelAnimationFrame(requestId);
            requestId = null;
        }, 500);
    }
}

export { getWindowFrameRate };