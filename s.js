try {
    (function(w, d) {
        zaraz.debug = (eZ="")=>{
            document.cookie = `zarazDebug=${eZ}; path=/`;
            location.reload()
        }
        ;
        window.zaraz._al = function(eJ, eK, eL) {
            w.zaraz.listeners.push({
                item: eJ,
                type: eK,
                callback: eL
            });
            eJ.addEventListener(eK, eL)
        }
        ;
        zaraz.preview = (eM="")=>{
            document.cookie = `zarazPreview=${eM}; path=/`;
            location.reload()
        }
        ;
        zaraz.i = function(eQ) {
            const eR = d.createElement("div");
            eR.innerHTML = unescape(eQ);
            const eS = eR.querySelectorAll("script");
            for (let eT = 0; eT < eS.length; eT++) {
                const eU = d.createElement("script");
                eS[eT].innerHTML && (eU.innerHTML = eS[eT].innerHTML);
                for (const eV of eS[eT].attributes)
                    eU.setAttribute(eV.name, eV.value);
                d.head.appendChild(eU);
                eS[eT].remove()
            }
            d.body.appendChild(eR)
        }
        ;
        zaraz.f = async function(eW, eX) {
            const eY = {
                credentials: "include",
                keepalive: !0,
                mode: "no-cors"
            };
            if (eX) {
                eY.method = "POST";
                eY.body = new URLSearchParams(eX);
                eY.headers = {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
            return await fetch(eW, eY)
        }
        ;
        window.zaraz._p = async cN=>new Promise((cO=>{
            if (cN) {
                cN.e && cN.e.forEach((cP=>{
                    try {
                        new Function(cP)()
                    } catch (cQ) {
                        console.error(`Error executing script: ${cP}\n`, cQ)
                    }
                }
                ));
                Promise.allSettled((cN.f || []).map((cR=>fetch(cR[0], cR[1]))))
            }
            cO()
        }
        ));
        zaraz.pageVariables = {};
        zaraz.__zcl = zaraz.__zcl || {};
        zaraz.track = async function(ei, ej, ek) {
            return new Promise(((el,em)=>{
                const en = {
                    name: ei,
                    data: {}
                };
                for (const eo of [localStorage, sessionStorage])
                    Object.keys(eo || {}).filter((eq=>eq.startsWith("_zaraz_"))).forEach((ep=>{
                        try {
                            en.data[ep.slice(7)] = JSON.parse(eo.getItem(ep))
                        } catch {
                            en.data[ep.slice(7)] = eo.getItem(ep)
                        }
                    }
                    ));
                Object.keys(zaraz.pageVariables).forEach((er=>en.data[er] = JSON.parse(zaraz.pageVariables[er])));
                Object.keys(zaraz.__zcl).forEach((es=>en.data[`__zcl_${es}`] = zaraz.__zcl[es]));
                en.data.__zarazMCListeners = zaraz.__zarazMCListeners;
                //
                en.data = {
                    ...en.data,
                    ...ej
                };
                en.zarazData = zarazData;
                fetch("/cdn-cgi/zaraz/t", {
                    credentials: "include",
                    keepalive: !0,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(en)
                }).catch((()=>{
                    //
                    return fetch("/cdn-cgi/zaraz/t", {
                        credentials: "include",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(en)
                    })
                }
                )).then((function(eu) {
                    zarazData._let = (new Date).getTime();
                    eu.ok || em();
                    return 204 !== eu.status && eu.json()
                }
                )).then((async et=>{
                    await zaraz._p(et);
                    "function" == typeof ek && ek()
                }
                )).finally((()=>el()))
            }
            ))
        }
        ;
        zaraz.set = function(ev, ew, ex) {
            try {
                ew = JSON.stringify(ew)
            } catch (ey) {
                return
            }
            prefixedKey = "_zaraz_" + ev;
            sessionStorage && sessionStorage.removeItem(prefixedKey);
            localStorage && localStorage.removeItem(prefixedKey);
            delete zaraz.pageVariables[ev];
            if (void 0 !== ew) {
                ex && "session" == ex.scope ? sessionStorage && sessionStorage.setItem(prefixedKey, ew) : ex && "page" == ex.scope ? zaraz.pageVariables[ev] = ew : localStorage && localStorage.setItem(prefixedKey, ew);
                zaraz.__watchVar = {
                    key: ev,
                    value: ew
                }
            }
        }
        ;
        for (const {m: ez, a: eA} of zarazData.q.filter((({m: eB})=>["debug", "set"].includes(eB))))
            zaraz[ez](...eA);
        for (const {m: eC, a: eD} of zaraz.q)
            zaraz[eC](...eD);
        delete zaraz.q;
        delete zarazData.q;
        zaraz.spaPageview = ()=>{
            zarazData.l = d.location.href;
            zarazData.t = d.title;
            zaraz.pageVariables = {};
            zaraz.__zarazMCListeners = {};
            zaraz.track("__zarazSPA")
        }
        ;
        zaraz.fulfilTrigger = function(fD, fE, fF, fG) {
            zaraz.__zarazTriggerMap || (zaraz.__zarazTriggerMap = {});
            zaraz.__zarazTriggerMap[fD] || (zaraz.__zarazTriggerMap[fD] = "");
            zaraz.__zarazTriggerMap[fD] += "*" + fE + "*";
            zaraz.track("__zarazEmpty", {
                ...fF,
                __zarazClientTriggers: zaraz.__zarazTriggerMap[fD]
            }, fG)
        }
        ;
        zaraz._processDataLayer = fw=>{
            for (const fx of Object.entries(fw))
                zaraz.set(fx[0], fx[1], {
                    scope: "page"
                });
            if (fw.event) {
                if (zarazData.dataLayerIgnore && zarazData.dataLayerIgnore.includes(fw.event))
                    return;
                let fy = {};
                for (let fz of dataLayer.slice(0, dataLayer.indexOf(fw) + 1))
                    fy = {
                        ...fy,
                        ...fz
                    };
                delete fy.event;
                fw.event.startsWith("gtm.") || zaraz.track(fw.event, fy)
            }
        }
        ;
        window.dataLayer = w.dataLayer || [];
        const fv = w.dataLayer.push;
        Object.defineProperty(w.dataLayer, "push", {
            configurable: !0,
            enumerable: !1,
            writable: !0,
            value: function(...fA) {
                let fB = fv.apply(this, fA);
                zaraz._processDataLayer(fA[0]);
                return fB
            }
        });
        dataLayer.forEach((fC=>zaraz._processDataLayer(fC)));
        zaraz._cts = ()=>{
            zaraz._timeouts && zaraz._timeouts.forEach((eg=>clearTimeout(eg)));
            zaraz._timeouts = []
        }
        ;
        zaraz._rl = function() {
            w.zaraz.listeners && w.zaraz.listeners.forEach((eh=>eh.item.removeEventListener(eh.type, eh.callback)));
            window.zaraz.listeners = []
        }
        ;
        history.pushState = function() {
            try {
                zaraz._rl();
                zaraz._cts && zaraz._cts()
            } finally {
                History.prototype.pushState.apply(history, arguments);
                setTimeout(zaraz.spaPageview, 100)
            }
        }
        ;
        history.replaceState = function() {
            try {
                zaraz._rl();
                zaraz._cts && zaraz._cts()
            } finally {
                History.prototype.replaceState.apply(history, arguments);
                setTimeout(zaraz.spaPageview, 100)
            }
        }
        ;
        zaraz._c = bG=>{
            const {event: bH, ...bI} = bG;
            zaraz.track(bH, {
                ...bI,
                __zarazClientEvent: !0
            })
        }
        ;
        zaraz._syncedAttributes = ["altKey", "clientX", "clientY", "pageX", "pageY", "button"];
        zaraz.__zcl.track = !0;
        d.addEventListener("visibilitychange", (j=>{
            zaraz._c({
                event: "visibilityChange",
                visibilityChange: [{
                    state: d.visibilityState,
                    timestamp: (new Date).getTime()
                }]
            }, 1)
        }
        ));
        zaraz.__zcl.visibilityChange = !0;
        zaraz.__zarazMCListeners = {
            "google-analytics_v4_20ac": ["visibilityChange"]
        };
        zaraz._p({
            "e": ["(function(w,d){w.zarazData.executed.push(\"Pageview\");})(window,document)"],
            "f": [["https://stats.g.doubleclick.net/g/collect?t=dc&aip=1&_r=3&v=1&_v=j86&tid=G-SEKJ4E9T4H&cid=83ca08b3-f0e9-4a45-b00f-08076aec7bdd&_u=KGDAAEADQAAAAC%7E&z=1739871023", {}]]
        })
    }
    )(window, document)
} catch (e) {
    throw fetch("/cdn-cgi/zaraz/t"),
    e;
}
