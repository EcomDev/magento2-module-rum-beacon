function Ct() {
  const e = document.querySelector('script[type="text/x-rum-beacon-config"]');
  if (!e)
    return !1;
  const t = JSON.parse(e.textContent);
  return !t.isEnabled || !t.ingestionUrl || !t.pageInfo ? !1 : t;
}
function Lt(e) {
  const t = {
    type: e.pageInfo.type,
    store: e.pageInfo.store,
    info: Object.assign({}, e.pageInfo),
    isCached: !1
  };
  return t.info.identifer && (t.identifier = t.info.identifer), delete t.info.type, delete t.info.identifer, delete t.info.store, e.isUrlCollected && (t.request_uri = location.pathname, t.request_query = {}, location.search && new URLSearchParams(location.search).forEach((i, n) => {
    e.allowedQueryParams[n] && (t.request_query[n] = i);
  })), t;
}
function Mt(e) {
  return !!e.ttfb || !!e.fcp || !!e.lcp || !!e.cls || !!e.inp;
}
function wt(e, t) {
  const r = JSON.stringify(t);
  navigator.sendBeacon(
    e.ingestionUrl,
    r
  ), delete t.ttfb, delete t.fcp, delete t.lcp, delete t.cls, delete t.inp;
}
class ot {
  t;
  o = 0;
  i = [];
  u(t) {
    if (t.hadRecentInput) return;
    const r = this.i[0], i = this.i.at(-1);
    this.o && r && i && t.startTime - i.startTime < 1e3 && t.startTime - r.startTime < 5e3 ? (this.o += t.value, this.i.push(t)) : (this.o = t.value, this.i = [t]), this.t?.(t);
  }
}
const I = () => {
  const e = performance.getEntriesByType("navigation")[0];
  if (e && e.responseStart > 0 && e.responseStart < performance.now()) return e;
}, R = (e) => {
  if (document.readyState === "loading") return "loading";
  {
    const t = I();
    if (t) {
      if (e < t.domInteractive) return "loading";
      if (t.domContentLoadedEventStart === 0 || e < t.domContentLoadedEventStart) return "dom-interactive";
      if (t.domComplete === 0 || e < t.domComplete) return "dom-content-loaded";
    }
  }
  return "complete";
}, xt = (e) => {
  const t = e.nodeName;
  return e.nodeType === 1 ? t.toLowerCase() : t.toUpperCase().replace(/^#/, "");
}, Z = (e) => {
  let t = "";
  try {
    for (; e?.nodeType !== 9; ) {
      const r = e, i = r.id ? "#" + r.id : [xt(r), ...Array.from(r.classList).sort()].join(".");
      if (t.length + i.length > 99) return t || i;
      if (t = t ? i + ">" + t : i, r.id) break;
      e = r.parentNode;
    }
  } catch {
  }
  return t;
}, Q = /* @__PURE__ */ new WeakMap();
function w(e, t) {
  return Q.get(e) || Q.set(e, new t()), Q.get(e);
}
let yt = -1;
const bt = () => yt, P = (e) => {
  addEventListener("pageshow", (t) => {
    t.persisted && (yt = t.timeStamp, e(t));
  }, !0);
}, b = (e, t, r, i) => {
  let n, o;
  return (a) => {
    t.value >= 0 && (a || i) && (o = t.value - (n ?? 0), (o || n === void 0) && (n = t.value, t.delta = o, t.rating = ((s, u) => s > u[1] ? "poor" : s > u[0] ? "needs-improvement" : "good")(t.value, r), e(t)));
  };
}, tt = (e) => {
  requestAnimationFrame(() => requestAnimationFrame(() => e()));
}, F = () => I()?.activationStart ?? 0, S = (e, t = -1) => {
  const r = I();
  let i = "navigate";
  return bt() >= 0 ? i = "back-forward-cache" : r && (document.prerendering || F() > 0 ? i = "prerender" : document.wasDiscarded ? i = "restore" : r.type && (i = r.type.replace(/_/g, "-"))), { name: e, value: t, rating: "good", delta: 0, entries: [], id: `v5-${Date.now()}-${Math.floor(8999999999999 * Math.random()) + 1e12}`, navigationType: i };
}, x = (e, t, r = {}) => {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(e)) {
      const i = new PerformanceObserver((n) => {
        Promise.resolve().then(() => {
          t(n.getEntries());
        });
      });
      return i.observe({ type: e, buffered: !0, ...r }), i;
    }
  } catch {
  }
}, et = (e) => {
  let t = !1;
  return () => {
    t || (e(), t = !0);
  };
};
let M = -1;
const st = () => document.visibilityState !== "hidden" || document.prerendering ? 1 / 0 : 0, j = (e) => {
  document.visibilityState === "hidden" && M > -1 && (M = e.type === "visibilitychange" ? e.timeStamp : 0, It());
}, ct = () => {
  addEventListener("visibilitychange", j, !0), addEventListener("prerenderingchange", j, !0);
}, It = () => {
  removeEventListener("visibilitychange", j, !0), removeEventListener("prerenderingchange", j, !0);
}, St = () => {
  if (M < 0) {
    const e = F();
    M = (document.prerendering ? void 0 : globalThis.performance.getEntriesByType("visibility-state").filter((r) => r.name === "hidden" && r.startTime > e)[0]?.startTime) ?? st(), ct(), P(() => {
      setTimeout(() => {
        M = st(), ct();
      });
    });
  }
  return { get firstHiddenTime() {
    return M;
  } };
}, U = (e) => {
  document.prerendering ? addEventListener("prerenderingchange", () => e(), !0) : e();
}, ut = [1800, 3e3], Et = (e, t = {}) => {
  U(() => {
    const r = St();
    let i, n = S("FCP");
    const o = x("paint", (a) => {
      for (const s of a) s.name === "first-contentful-paint" && (o.disconnect(), s.startTime < r.firstHiddenTime && (n.value = Math.max(s.startTime - F(), 0), n.entries.push(s), i(!0)));
    });
    o && (i = b(e, n, ut, t.reportAllChanges), P((a) => {
      n = S("FCP"), i = b(e, n, ut, t.reportAllChanges), tt(() => {
        n.value = performance.now() - a.timeStamp, i(!0);
      });
    }));
  });
}, lt = [0.1, 0.25], dt = (e) => e.find((t) => t.node?.nodeType === 1) || e[0], Pt = (e, t = {}) => {
  const r = w(t = Object.assign({}, t), ot), i = /* @__PURE__ */ new WeakMap();
  r.t = (n) => {
    if (n?.sources?.length) {
      const o = dt(n.sources);
      if (o) {
        const a = (t.generateTarget ?? Z)(o.node);
        i.set(o, a);
      }
    }
  }, ((n, o = {}) => {
    Et(et(() => {
      let a, s = S("CLS", 0);
      const u = w(o, ot), g = (h) => {
        for (const T of h) u.u(T);
        u.o > s.value && (s.value = u.o, s.entries = u.i, a());
      }, m = x("layout-shift", g);
      m && (a = b(n, s, lt, o.reportAllChanges), document.addEventListener("visibilitychange", () => {
        document.visibilityState === "hidden" && (g(m.takeRecords()), a(!0));
      }), P(() => {
        u.o = 0, s = S("CLS", 0), a = b(n, s, lt, o.reportAllChanges), tt(() => a());
      }), setTimeout(a));
    }));
  })((n) => {
    const o = ((a) => {
      let s = {};
      if (a.entries.length) {
        const u = a.entries.reduce((g, m) => g.value > m.value ? g : m);
        if (u?.sources?.length) {
          const g = dt(u.sources);
          g && (s = { largestShiftTarget: i.get(g), largestShiftTime: u.startTime, largestShiftValue: u.value, largestShiftSource: g, largestShiftEntry: u, loadState: R(u.startTime) });
        }
      }
      return Object.assign(a, { attribution: s });
    })(n);
    e(o);
  }, t);
}, At = (e, t = {}) => {
  Et((r) => {
    const i = ((n) => {
      let o = { timeToFirstByte: 0, firstByteToFCP: n.value, loadState: R(bt()) };
      if (n.entries.length) {
        const a = I(), s = n.entries.at(-1);
        if (a) {
          const u = a.activationStart || 0, g = Math.max(0, a.responseStart - u);
          o = { timeToFirstByte: g, firstByteToFCP: n.value - g, loadState: R(n.entries[0].startTime), navigationEntry: a, fcpEntry: s };
        }
      }
      return Object.assign(n, { attribution: o });
    })(r);
    e(i);
  }, t);
};
let Dt = 0, G = 1 / 0, O = 0;
const Ft = (e) => {
  for (const t of e) t.interactionId && (G = Math.min(G, t.interactionId), O = Math.max(O, t.interactionId), Dt = O ? (O - G) / 7 + 1 : 0);
};
let K;
const gt = () => K ? Dt : performance.interactionCount ?? 0, kt = () => {
  "interactionCount" in performance || K || (K = x("event", Ft, { type: "event", buffered: !0, durationThreshold: 0 }));
};
let ft = 0;
class mt {
  l = [];
  h = /* @__PURE__ */ new Map();
  m;
  p;
  v() {
    ft = gt(), this.l.length = 0, this.h.clear();
  }
  M() {
    const t = Math.min(this.l.length - 1, Math.floor((gt() - ft) / 50));
    return this.l[t];
  }
  u(t) {
    if (this.m?.(t), !t.interactionId && t.entryType !== "first-input") return;
    const r = this.l.at(-1);
    let i = this.h.get(t.interactionId);
    if (i || this.l.length < 10 || t.duration > r.T) {
      if (i ? t.duration > i.T ? (i.entries = [t], i.T = t.duration) : t.duration === i.T && t.startTime === i.entries[0].startTime && i.entries.push(t) : (i = { id: t.interactionId, entries: [t], T: t.duration }, this.h.set(i.id, i), this.l.push(i)), this.l.sort((n, o) => o.T - n.T), this.l.length > 10) {
        const n = this.l.splice(10);
        for (const o of n) this.h.delete(o.id);
      }
      this.p?.(i);
    }
  }
}
const X = (e) => {
  const t = globalThis.requestIdleCallback || setTimeout;
  document.visibilityState === "hidden" ? e() : (e = et(e), document.addEventListener("visibilitychange", e, { once: !0 }), t(() => {
    e(), document.removeEventListener("visibilitychange", e);
  }));
}, pt = [200, 500], Bt = (e, t = {}) => {
  const r = w(t = Object.assign({}, t), mt);
  let i = [], n = [], o = 0;
  const a = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap();
  let u = !1;
  const g = () => {
    u || (X(m), u = !0);
  }, m = () => {
    const c = r.l.map((p) => a.get(p.entries[0])), l = n.length - 50;
    n = n.filter((p, y) => y >= l || c.includes(p));
    const d = /* @__PURE__ */ new Set();
    for (const p of n) {
      const y = h(p.startTime, p.processingEnd);
      for (const C of y) d.add(C);
    }
    const f = i.length - 1 - 50;
    i = i.filter((p, y) => p.startTime > o && y > f || d.has(p)), u = !1;
  };
  r.m = (c) => {
    const l = c.startTime + c.duration;
    let d;
    o = Math.max(o, c.processingEnd);
    for (let f = n.length - 1; f >= 0; f--) {
      const p = n[f];
      if (Math.abs(l - p.renderTime) <= 8) {
        d = p, d.startTime = Math.min(c.startTime, d.startTime), d.processingStart = Math.min(c.processingStart, d.processingStart), d.processingEnd = Math.max(c.processingEnd, d.processingEnd), d.entries.push(c);
        break;
      }
    }
    d || (d = { startTime: c.startTime, processingStart: c.processingStart, processingEnd: c.processingEnd, renderTime: l, entries: [c] }, n.push(d)), (c.interactionId || c.entryType === "first-input") && a.set(c, d), g();
  }, r.p = (c) => {
    if (!s.get(c)) {
      const l = (t.generateTarget ?? Z)(c.entries[0].target);
      s.set(c, l);
    }
  };
  const h = (c, l) => {
    const d = [];
    for (const f of i) if (!(f.startTime + f.duration < c)) {
      if (f.startTime > l) break;
      d.push(f);
    }
    return d;
  }, T = (c) => {
    const l = c.entries[0], d = a.get(l), f = l.processingStart, p = Math.max(l.startTime + l.duration, f), y = Math.min(d.processingEnd, p), C = d.entries.sort((v, D) => v.processingStart - D.processingStart), N = h(l.startTime, y), L = r.h.get(l.interactionId), k = { interactionTarget: s.get(L), interactionType: l.name.startsWith("key") ? "keyboard" : "pointer", interactionTime: l.startTime, nextPaintTime: p, processedEventEntries: C, longAnimationFrameEntries: N, inputDelay: f - l.startTime, processingDuration: y - f, presentationDelay: p - y, loadState: R(l.startTime), longestScript: void 0, totalScriptDuration: void 0, totalStyleAndLayoutDuration: void 0, totalPaintDuration: void 0, totalUnattributedDuration: void 0 };
    return ((v) => {
      if (!v.longAnimationFrameEntries?.length) return;
      const D = v.interactionTime, _ = v.inputDelay, nt = v.processingDuration;
      let W, H, $ = 0, A = 0, V = 0, z = 0;
      for (const B of v.longAnimationFrameEntries) {
        A = A + B.startTime + B.duration - B.styleAndLayoutStart;
        for (const E of B.scripts) {
          const rt = E.startTime + E.duration;
          if (rt < D) continue;
          const q = rt - Math.max(D, E.startTime), at = E.duration ? q / E.duration * E.forcedStyleAndLayoutDuration : 0;
          $ += q - at, A += at, q > z && (H = E.startTime < D + _ ? "input-delay" : E.startTime >= D + _ + nt ? "presentation-delay" : "processing-duration", W = E, z = q);
        }
      }
      const J = v.longAnimationFrameEntries.at(-1), it = J ? J.startTime + J.duration : 0;
      it >= D + _ + nt && (V = v.nextPaintTime - it), W && H && (v.longestScript = { entry: W, subpart: H, intersectingDuration: z }), v.totalScriptDuration = $, v.totalStyleAndLayoutDuration = A, v.totalPaintDuration = V, v.totalUnattributedDuration = v.nextPaintTime - D - $ - A - V;
    })(k), Object.assign(c, { attribution: k });
  };
  x("long-animation-frame", (c) => {
    i = i.concat(c), g();
  }), ((c, l = {}) => {
    globalThis.PerformanceEventTiming && "interactionId" in PerformanceEventTiming.prototype && U(() => {
      kt();
      let d, f = S("INP");
      const p = w(l, mt), y = (N) => {
        X(() => {
          for (const k of N) p.u(k);
          const L = p.M();
          L && L.T !== f.value && (f.value = L.T, f.entries = L.entries, d());
        });
      }, C = x("event", y, { durationThreshold: l.durationThreshold ?? 40 });
      d = b(c, f, pt, l.reportAllChanges), C && (C.observe({ type: "first-input", buffered: !0 }), document.addEventListener("visibilitychange", () => {
        document.visibilityState === "hidden" && (y(C.takeRecords()), d(!0));
      }), P(() => {
        p.v(), f = S("INP"), d = b(c, f, pt, l.reportAllChanges);
      }));
    });
  })((c) => {
    const l = T(c);
    e(l);
  }, t);
};
class ht {
  m;
  u(t) {
    this.m?.(t);
  }
}
const vt = [2500, 4e3], qt = (e, t = {}) => {
  const r = w(t = Object.assign({}, t), ht), i = /* @__PURE__ */ new WeakMap();
  r.m = (n) => {
    if (n.element) {
      const o = (t.generateTarget ?? Z)(n.element);
      i.set(n, o);
    }
  }, ((n, o = {}) => {
    U(() => {
      const a = St();
      let s, u = S("LCP");
      const g = w(o, ht), m = (T) => {
        o.reportAllChanges || (T = T.slice(-1));
        for (const c of T) g.u(c), c.startTime < a.firstHiddenTime && (u.value = Math.max(c.startTime - F(), 0), u.entries = [c], s());
      }, h = x("largest-contentful-paint", m);
      if (h) {
        s = b(n, u, vt, o.reportAllChanges);
        const T = et(() => {
          m(h.takeRecords()), h.disconnect(), s(!0);
        });
        for (const c of ["keydown", "click", "visibilitychange"]) addEventListener(c, () => X(T), { capture: !0, once: !0 });
        P((c) => {
          u = S("LCP"), s = b(n, u, vt, o.reportAllChanges), tt(() => {
            u.value = performance.now() - c.timeStamp, s(!0);
          });
        });
      }
    });
  })((n) => {
    const o = ((a) => {
      let s = { timeToFirstByte: 0, resourceLoadDelay: 0, resourceLoadDuration: 0, elementRenderDelay: a.value };
      if (a.entries.length) {
        const u = I();
        if (u) {
          const g = u.activationStart || 0, m = a.entries.at(-1), h = m.url && performance.getEntriesByType("resource").filter((d) => d.name === m.url)[0], T = Math.max(0, u.responseStart - g), c = Math.max(T, h ? (h.requestStart || h.startTime) - g : 0), l = Math.min(a.value, Math.max(c, h ? h.responseEnd - g : 0));
          s = { target: i.get(m), timeToFirstByte: T, resourceLoadDelay: c - T, resourceLoadDuration: l - c, elementRenderDelay: a.value - l, navigationEntry: u, lcpEntry: m }, m.url && (s.url = m.url), h && (s.lcpResourceEntry = h);
        }
      }
      return Object.assign(a, { attribution: s });
    })(n);
    e(o);
  }, t);
}, Tt = [800, 1800], Y = (e) => {
  document.prerendering ? U(() => Y(e)) : document.readyState !== "complete" ? addEventListener("load", () => Y(e), !0) : setTimeout(e);
}, Ot = (e, t = {}) => {
  ((r, i = {}) => {
    let n = S("TTFB"), o = b(r, n, Tt, i.reportAllChanges);
    Y(() => {
      const a = I();
      a && (n.value = Math.max(a.responseStart - F(), 0), n.entries = [a], o(!0), P(() => {
        n = S("TTFB", 0), o = b(r, n, Tt, i.reportAllChanges), o(!0);
      }));
    });
  })((r) => {
    const i = ((n) => {
      let o = { waitingDuration: 0, cacheDuration: 0, dnsDuration: 0, connectionDuration: 0, requestDuration: 0 };
      if (n.entries.length) {
        const a = n.entries[0], s = a.activationStart || 0, u = Math.max((a.workerStart || a.fetchStart) - s, 0), g = Math.max(a.domainLookupStart - s, 0), m = Math.max(a.connectStart - s, 0), h = Math.max(a.connectEnd - s, 0);
        o = { waitingDuration: u, cacheDuration: g - u, dnsDuration: m - g, connectionDuration: h - m, requestDuration: n.value - h, navigationEntry: a };
      }
      return Object.assign(n, { attribution: o });
    })(r);
    e(i);
  }, t);
}, Rt = /^[0-9]+$/, jt = "cache", Ut = "hit";
function Nt(e) {
  Ot((t) => {
    const r = {
      value: t.value,
      cache: t.attribution.cacheDuration,
      connection: t.attribution.connectionDuration ?? 0,
      request: t.attribution.requestDuration ?? 0,
      waiting: t.attribution.waitingDuration ?? 0,
      isCached: !1,
      navigationType: t.navigationType,
      serverTiming: {}
    };
    if (t.attribution.navigationEntry) {
      let i = 0;
      for (const { duration: n, description: o, name: a } of t.attribution.navigationEntry.serverTiming) {
        let s = !0;
        n > 0 ? (s = n, i = Math.max(i, n)) : n <= 0 && Rt.test(o) ? s = parseInt(o) : a === jt ? (s = o === Ut, r.isCached = s) : o && (s = o), r.serverTiming[a] = s;
      }
      r.isCached === !1 && r.waiting > 0 && r.waiting < i && (r.isCached = !0);
    }
    e.ttfb = r, e.pageInfo.isCached = r.isCached;
  }, {
    reportAllChanges: !0
  });
}
function _t(e) {
  At((t) => {
    e.fcp = {
      value: t.value,
      navigationType: t.navigationType,
      renderDelay: t.attribution.firstByteToFCP,
      ttfb: t.attribution.timeToFirstByte
    };
  });
}
function Wt(e) {
  qt((t) => {
    e.lcp = {
      value: t.value,
      navigationType: t.navigationType,
      load: t.attribution.resourceLoadDuration,
      loadDelay: t.attribution.resourceLoadDelay,
      renderDelay: t.attribution.elementRenderDelay,
      ttfb: t.attribution.timeToFirstByte,
      target: t.attribution.target ?? "",
      url: t.attribution.url ?? ""
    };
  });
}
function Ht(e) {
  Pt((t) => {
    e.cls = {
      value: t.value,
      navigationType: t.navigationType,
      target: t.attribution.largestShiftTarget ?? "",
      time: t.attribution.largestShiftTime ?? 0
    };
  });
}
function $t(e) {
  Bt((t) => {
    const r = t.attribution.longestScript, i = {
      value: t.value,
      navigationType: t.navigationType,
      intersection: r?.intersectingDuration ?? 0,
      target: t.attribution.interactionTarget
    };
    if (r) {
      try {
        const n = new URL(r.entry.sourceURL);
        i.script_domain = n.host, i.script_path = n.pathname;
      } catch {
      }
      i.affected_part = r.subpart;
    }
    e.inp = i;
  });
}
function Vt() {
  const e = Ct();
  if (e === !1)
    return;
  const t = {
    pageInfo: Lt(e)
  };
  Nt(t), _t(t), Wt(t), Ht(t), $t(t), addEventListener("visibilitychange", () => {
    document.visibilityState === "hidden" && Mt(t) && wt(e, t);
  });
}
setTimeout(Vt);
