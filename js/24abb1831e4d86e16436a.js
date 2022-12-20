(async () => {
    const ua = navigator.userAgent;

    const l = () => {
        try {
            return Intl.Collator().resolvedOptions().locale;
        } catch (err) {
            return false;
        };
    };
    const wgl = () => {
        try {
            let o = new OffscreenCanvas(256, 256).getContext('webgl');
            let od = o.getExtension('WEBGL_debug_renderer_info');
            return {
                'vendor': o.getParameter(od.UNMASKED_VENDOR_WEBGL),
                'renderer': o.getParameter(od.UNMASKED_RENDERER_WEBGL)
            };
        } catch (err) {
            let dc = document.createElement('canvas').getContext('webgl');
            return {
                'vendor': dc.getParameter(dc.VENDOR),
                'renderer': dc.getParameter(dc.RENDERER)
            };
        };
    };
    const drm = async (ua) => {
        if (ua.indexOf('Linux') >= 0 && ua.indexOf('Android') >= 0) {
            try {
                let v = document.createElement('video');
                return (v.canPlayType('audio/mpegurl') ? true : false);
            } catch (err) {
                return false;
            };
        };
        try {
            let i = (ua.indexOf('Mac OS X') < 0 ? 'com.widevine.alpha' : 'com.apple.fps');
            let r = (ua.indexOf('Mac OS X') < 0 ? [{ videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"', robustness: 'SW_SECURE_DECODE' }], persistentState: 'required' }] : [{ initDataTypes: ['sinf'], videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"', robustness: '' }], distinctiveIdentifier: 'not-allowed', persistentState: 'not-allowed', sessionTypes: ['temporary'] }]);
            let rM = navigator.requestMediaKeySystemAccess(i, r).then(keySystem => {
                return (keySystem ? true : false);
            }).catch(e => {
                return false;
            });
            return rM.then(function (s) {
                return (s ? s : false);
            });
        } catch (err) {
            return false;
        };
    };
    const wdr = () => {
        let documentDetectionKeys = [
            "__webdriver_evaluate",
            "__selenium_evaluate",
            "__webdriver_script_function",
            "__webdriver_script_func",
            "__webdriver_script_fn",
            "__fxdriver_evaluate",
            "__driver_unwrapped",
            "__webdriver_unwrapped",
            "__driver_evaluate",
            "__selenium_unwrapped",
            "__fxdriver_unwrapped",
        ];

        let windowDetectionKeys = [
            "_phantom",
            "__nightmare",
            "_selenium",
            "callPhantom",
            "callSelenium",
            "_Selenium_IDE_Recorder",
        ];

        for (const windowDetectionKey in windowDetectionKeys) {
            const windowDetectionKeyValue = windowDetectionKeys[windowDetectionKey];
            if (window[windowDetectionKeyValue]) {
                return true;
            };
        };
        for (const documentDetectionKey in documentDetectionKeys) {
            const documentDetectionKeyValue = documentDetectionKeys[documentDetectionKey];
            if (window['document'][documentDetectionKeyValue]) {
                return true;
            };
        };

        for (const documentKey in window['document']) {
            if (documentKey.match(/\$[a-z]dc_/) && window['document'][documentKey]['cache_']) {
                return true;
            };
        }

        if (window['external'] && window['external'].toString() && (window['external'].toString()['indexOf']('Sequentum') != -1)) return true;

        if (window['document']['documentElement']['getAttribute']('selenium')) return true;
        if (window['document']['documentElement']['getAttribute']('webdriver')) return true;
        if (window['document']['documentElement']['getAttribute']('driver')) return true;
        if (navigator.webdriver !== false) return true;

        return false;
    };
    const sn = () => {
        try {
            return (screen.width > screen.availWidth || screen.height > screen.availHeight);
        } catch (err) {
            return false;
        };
    };

    const html = (id, data) => {
        document.querySelector(id).innerHTML = data;
    };

    const lang = l();
    const scrn = sn();
    const webgl = wgl();
    const webdrivr = wdr();
    const drmSystem = await drm(ua);

    html('#ua', ua);
    html('#lang', (lang ? lang : 'невозможно определить'));
    html('#webgl-vendor', (webgl['vendor'] ? webgl['vendor'] : 'невозможно определить'));
    html('#webgl-renderer', (webgl['renderer'] ? webgl['renderer'] : 'невозможно определить'));
    html('#result', (!(lang) || !(scrn) || !(webgl) || webdrivr || !(drmSystem) ? 'использует' : 'не использует'));
})();