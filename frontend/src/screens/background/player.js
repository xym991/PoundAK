(() => {
  "use strict";
  function e(e, t) {
    if (!Object.prototype.hasOwnProperty.call(e, t))
      throw new TypeError("attempted to use private field on non-instance");
    return e;
  }
  var t = 0;
  function n(e) {
    return "__private_" + t++ + "_" + e;
  }
  let r, s, i;
  !(function (e) {
    (e.GameLaunched = "GameLaunched"),
      (e.GameInfo = "GameInfo"),
      (e.GameFeaturesSet = "GameFeaturesSet"),
      (e.GameEvent = "GameEvent"),
      (e.InfoUpdate = "InfoUpdate"),
      (e.GameEventError = "GameEventError"),
      (e.LauncherLaunched = "LauncherLaunched"),
      (e.LauncherUpdated = "LauncherUpdated"),
      (e.LauncherTerminated = "LauncherTerminated"),
      (e.LauncherFeaturesSet = "LauncherFeaturesSet"),
      (e.LauncherEvent = "LauncherEvent"),
      (e.LauncherInfoUpdate = "LauncherInfoUpdate");
  })(r || (r = {})),
    (function (e) {
      e[(e.Update = 0)] = "Update";
    })(s || (s = {})),
    (function (e) {
      (e[(e.Load = 0)] = "Load"),
        (e[(e.Play = 1)] = "Play"),
        (e[(e.Pause = 2)] = "Pause"),
        (e[(e.SetSeek = 3)] = "SetSeek"),
        (e[(e.SetSettings = 4)] = "SetSettings");
    })(i || (i = {}));
  let a;
  !(function (e) {
    (e.background = "background"), (e.main = "main");
  })(a || (a = {}));
  const o = `${overwolf.io.paths.documents}/overwolf-erp/`,
    u = "recording-",
    h = "header.json";
  let c;
  !(function (e) {
    (e[(e.Record = 0)] = "Record"),
      (e[(e.Play = 1)] = "Play"),
      (e[(e.Patch = 2)] = "Patch");
  })(c || (c = {}));
  r.GameLaunched,
    r.GameInfo,
    r.GameFeaturesSet,
    r.GameEvent,
    r.InfoUpdate,
    r.GameEventError,
    r.LauncherLaunched,
    r.LauncherUpdated,
    r.LauncherTerminated,
    r.LauncherFeaturesSet,
    r.LauncherEvent,
    r.LauncherInfoUpdate;
  function d(e) {
    return e.type === r.GameInfo;
  }
  function l(e) {
    return e.type === r.GameFeaturesSet;
  }
  function f(e) {
    return e.type === r.LauncherLaunched;
  }
  function m(e) {
    return e.type === r.LauncherUpdated;
  }
  function v(e) {
    return e.type === r.LauncherTerminated;
  }
  function g(e) {
    return e.type === r.LauncherFeaturesSet;
  }
  class p {
    #e = {};
    #t(e) {
      return "function" === typeof e;
    }
    hasListener(e) {
      const t = this.#e[e];
      return t && t.size > 0;
    }
    emit(...e) {
      const [t, n] = e;
      if (!this.hasListener(t)) return;
      const r = this.#e[t];
      r instanceof Map && r.size > 0 && r.forEach((e) => e(n));
    }
    on(e, t) {
      for (const n in e) {
        if (!e.hasOwnProperty(n)) continue;
        const r = e[n];
        void 0 !== r && this.#t(r) && this.addListener(n, r, t);
      }
    }
    addListener(e, t, n = t) {
      void 0 === this.#e[e] && (this.#e[e] = new Map()), this.#e[e].set(n, t);
    }
    off(e, t) {
      e.forEach((e) => this.removeListener(e, t));
    }
    removeListener(e, t) {
      const n = this.#e[e];
      void 0 !== n &&
        n.has(t) &&
        (n.delete(t), 0 === n.size && delete this.#e[e]);
    }
  }
  class y extends Error {
    constructor({ result: e, args: t = [] }) {
      let n = JSON.stringify(e);
      t && t.length && ` args: ${JSON.stringify(t)}`,
        super(n),
        (this.name = "OverwolfWindowError");
      const r = Error;
      r.captureStackTrace && r.captureStackTrace(this, y);
    }
  }
  function L(...e) {
    const t = e.length,
      n = [];
    for (let r = 0; r < t; r++) {
      const t = e[r];
      "object" !== typeof t || t instanceof Error
        ? n.push(t)
        : n.push(t, `${JSON.stringify(t)}`);
    }
    return n;
  }
  var w;
  !(function (e) {
    (e.getRunningGameInfo = "getRunningGameInfo"),
      (e.getRunningGameInfo2 = "getRunningGameInfo2"),
      (e.getRunningLaunchersInfo = "getRunningLaunchersInfo"),
      (e.onGameLaunched = "onGameLaunched"),
      (e.onGameUpdated = "onGameUpdated"),
      (e.onGameInfoUpdated = "onGameInfoUpdated"),
      (e.onInfoUpdates2 = "onInfoUpdates2"),
      (e.onNewEvents = "onNewEvents"),
      (e.onError = "onError"),
      (e.onLauncherLaunched = "onLauncherLaunched"),
      (e.onLauncherUpdated = "onLauncherUpdated"),
      (e.onLauncherTerminated = "onLauncherTerminated"),
      (e.onLauncherInfoUpdates = "onLauncherInfoUpdates"),
      (e.onLauncherEvents = "onLauncherEvent"),
      (e.setGameRequiredFeatures = "setGameRequiredFeatures"),
      (e.setLauncherRequiredFeatures = "setLauncherRequiredFeatures");
  })(w || (w = {}));
  class E extends p {
    replace() {
      (overwolf.games.onGameLaunched.addListener = (e) => {
        this.addListener(w.onGameLaunched, e);
      }),
        (overwolf.games.onGameLaunched.removeListener = (e) => {
          this.removeListener(w.onGameLaunched, e);
        }),
        (overwolf.games.onGameInfoUpdated.addListener = (e) => {
          this.addListener(w.onGameInfoUpdated, e);
        }),
        (overwolf.games.onGameInfoUpdated.removeListener = (e) => {
          this.removeListener(w.onGameInfoUpdated, e);
        }),
        (overwolf.games.events.onInfoUpdates2.addListener = (e) => {
          this.addListener(w.onInfoUpdates2, e);
        }),
        (overwolf.games.events.onInfoUpdates2.removeListener = (e) => {
          this.removeListener(w.onInfoUpdates2, e);
        }),
        (overwolf.games.events.onNewEvents.addListener = (e) => {
          this.addListener(w.onNewEvents, e);
        }),
        (overwolf.games.events.onNewEvents.removeListener = (e) => {
          this.removeListener(w.onNewEvents, e);
        }),
        (overwolf.games.events.onError.addListener = (e) => {
          this.addListener(w.onError, e);
        }),
        (overwolf.games.events.onError.removeListener = (e) => {
          this.removeListener(w.onError, e);
        }),
        (overwolf.games.launchers.onLaunched.addListener = (e) => {
          this.addListener(w.onLauncherLaunched, e);
        }),
        (overwolf.games.launchers.onLaunched.removeListener = (e) => {
          this.removeListener(w.onLauncherLaunched, e);
        }),
        (overwolf.games.launchers.onUpdated.addListener = (e) => {
          this.addListener(w.onLauncherUpdated, e);
        }),
        (overwolf.games.launchers.onUpdated.removeListener = (e) => {
          this.removeListener(w.onLauncherUpdated, e);
        }),
        (overwolf.games.launchers.onTerminated.addListener = (e) => {
          this.addListener(w.onLauncherTerminated, e);
        }),
        (overwolf.games.launchers.onTerminated.removeListener = (e) => {
          this.removeListener(w.onLauncherTerminated, e);
        }),
        (overwolf.games.launchers.events.onInfoUpdates.addListener = (e) => {
          this.addListener(w.onLauncherInfoUpdates, e);
        }),
        (overwolf.games.launchers.events.onInfoUpdates.removeListener = (e) => {
          this.removeListener(w.onLauncherInfoUpdates, e);
        }),
        (overwolf.games.launchers.events.onNewEvents.addListener = (e) => {
          this.addListener(w.onLauncherEvents, e);
        }),
        (overwolf.games.launchers.events.onNewEvents.removeListener = (e) => {
          this.removeListener(w.onLauncherEvents, e);
        }),
        (overwolf.games.getRunningGameInfo = (e) =>
          this.emit(w.getRunningGameInfo, e)),
        (overwolf.games.getRunningGameInfo2 = (e) =>
          this.emit(w.getRunningGameInfo2, e)),
        (overwolf.games.launchers.getRunningLaunchersInfo = (e) =>
          this.emit(w.getRunningLaunchersInfo, e)),
        (overwolf.games.events.setRequiredFeatures = (e, t) =>
          this.emit(w.setGameRequiredFeatures, t)),
        (overwolf.games.launchers.events.setRequiredFeatures = (e, t, n) =>
          this.emit(w.setLauncherRequiredFeatures, n));
    }
    fireEvent(e) {
      !(function (e) {
        return e.type === r.GameLaunched;
      })(e)
        ? d(e)
          ? this.emit(w.onGameInfoUpdated, e.data)
          : !(function (e) {
                return e.type === r.GameEvent;
              })(e)
            ? !(function (e) {
                return e.type === r.GameEventError;
              })(e)
              ? !(function (e) {
                  return e.type === r.InfoUpdate;
                })(e)
                ? f(e)
                  ? this.emit(w.onLauncherLaunched, e.data)
                  : m(e)
                    ? this.emit(w.onLauncherUpdated, e.data)
                    : v(e)
                      ? this.emit(w.onLauncherTerminated, e.data)
                      : !(function (e) {
                            return e.type === r.LauncherInfoUpdate;
                          })(e)
                        ? !(function (e) {
                            return e.type === r.LauncherEvent;
                          })(e)
                          ? console.log(
                              "Event Player: OverwolfAPIEvents.fireEvent(): not a fireable event:",
                              e
                            )
                          : this.emit(w.onLauncherEvents, e.data)
                        : this.emit(w.onLauncherInfoUpdates, e.data)
                : this.emit(w.onInfoUpdates2, e.data)
              : this.emit(w.onError, e.data)
            : this.emit(w.onNewEvents, e.data)
        : this.emit(w.onGameLaunched, e.data);
    }
  }
  const P = (e, t) => (
      e.sort(), t.sort(), JSON.stringify(e) === JSON.stringify(t)
    ),
    I = (e, t, n) =>
      e
        ? 0 === t.length && 0 === n.length
          ? e
          : e.filter(([, e]) => {
              return (
                !t.includes(e.type) &&
                !(
                  ((s = e).type === r.GameEvent ||
                    s.type === r.InfoUpdate ||
                    s.type === r.LauncherEvent ||
                    s.type === r.LauncherInfoUpdate) &&
                  n.includes(e.data.feature)
                )
              );
              var s;
            })
        : null;
  var G = n("recording"),
    b = n("timeline"),
    U = n("playing"),
    R = n("seek"),
    F = n("speed"),
    S = n("tickCounter"),
    T = n("nextTickTimeout"),
    O = n("featuresFilter"),
    j = n("typesFilter"),
    k = n("cancelTick"),
    N = n("prepareTick"),
    q = n("tick"),
    M = n("playFrames");
  class B extends p {
    constructor(...e) {
      super(...e),
        Object.defineProperty(this, M, { value: D }),
        Object.defineProperty(this, q, { value: A }),
        Object.defineProperty(this, N, { value: x }),
        Object.defineProperty(this, k, { value: W }),
        Object.defineProperty(this, G, { writable: !0, value: null }),
        Object.defineProperty(this, b, { writable: !0, value: [] }),
        Object.defineProperty(this, U, { writable: !0, value: !1 }),
        Object.defineProperty(this, R, { writable: !0, value: 0 }),
        Object.defineProperty(this, F, { writable: !0, value: 1 }),
        Object.defineProperty(this, S, { writable: !0, value: 0 }),
        Object.defineProperty(this, T, { writable: !0, value: null }),
        Object.defineProperty(this, O, { writable: !0, value: [] }),
        Object.defineProperty(this, j, { writable: !0, value: [] });
    }
    get loaded() {
      return null !== e(this, G)[G];
    }
    get recording() {
      return e(this, G)[G];
    }
    get playing() {
      return e(this, U)[U];
    }
    get seek() {
      return e(this, R)[R];
    }
    get speed() {
      return e(this, F)[F];
    }
    get featuresFilter() {
      return e(this, O)[O];
    }
    get typesFilter() {
      return e(this, j)[j];
    }
    get stopped() {
      return !e(this, U)[U] && e(this, R)[R] >= this.recordingLength;
    }
    get recordingLength() {
      return null === e(this, G)[G]
        ? 0
        : e(this, G)[G].endTime - e(this, G)[G].startTime;
    }
    load(t, n) {
      var r;
      this.pause(),
        (e(this, G)[G] = t),
        (e(this, F)[F] = n.speed),
        (e(this, b)[b] =
          null !== (r = I(t.timeline, n.typesFilter, n.featuresFilter)) &&
          void 0 !== r
            ? r
            : []),
        this.emit("load", t.uid),
        console.log("Event Player: loaded recording:", t.title, t.uid, ...L(n));
    }
    unload() {
      this.pause(),
        (e(this, G)[G] = null),
        (e(this, R)[R] = 0),
        this.emit("unload");
    }
    play() {
      e(this, U)[U] ||
        (e(this, G)[G] &&
          ((e(this, U)[U] = !0),
          (e(this, S)[S] = 0),
          this.emit("playing", !0),
          e(this, R)[R] >= this.recordingLength && this.setSeek(0),
          e(this, N)[N]()));
    }
    pause() {
      e(this, U)[U] &&
        e(this, G)[G] &&
        ((e(this, U)[U] = !1),
        (e(this, S)[S] = 0),
        e(this, k)[k](),
        this.emit("playing", !1));
    }
    setSeek(t) {
      if (!e(this, G)[G])
        return void console.log("Event Player: setSeek(): no recording");
      const n = Math.min(Math.max(Math.round(t), 0), this.recordingLength);
      e(this, R)[R] !== n && ((e(this, R)[R] = n), this.emit("seek", n));
    }
    setSpeed(t) {
      e(this, F)[F] = t;
    }
    setSettings(t) {
      var n, r;
      const s =
        null !==
          (n =
            null === (r = e(this, G)[G]) || void 0 === r
              ? void 0
              : r.timeline) && void 0 !== n
          ? n
          : [];
      var i;
      ((e(this, F)[F] = t.speed),
      P(e(this, j)[j], t.typesFilter) && P(e(this, O)[O], t.featuresFilter)) ||
        (e(this, U)[U] && this.pause(),
        (e(this, j)[j] = t.typesFilter),
        (e(this, O)[O] = t.featuresFilter),
        (e(this, b)[b] =
          null !== (i = I(s, t.typesFilter, t.featuresFilter)) && void 0 !== i
            ? i
            : []));
    }
    getRunningGameInfo(t) {
      if (!e(this, G)[G])
        return console.log("Event Player: no recording"), t(null);
      const n = e(this, G)[G].startTime + e(this, R)[R],
        r = B.getEventByTypeRecent(e(this, b)[b], n, d);
      if (!r || !r.data || !r.data.gameInfo) return t(null);
      t({ success: !0, ...r.data.gameInfo, overlayInfo: {} });
    }
    getRunningGameInfo2(t) {
      try {
        if (!e(this, G)[G]) throw new Error("Event Player: no recording");
        const n = e(this, G)[G].startTime + e(this, R)[R],
          r = B.getEventByTypeRecent(e(this, b)[b], n, d);
        t({
          success: !0,
          gameInfo:
            null !== r && void 0 !== r && r.data.gameInfo
              ? { ...r.data.gameInfo, overlayInfo: {} }
              : null,
        });
      } catch (n) {
        console.warn(n), t({ success: !1, error: String(n), gameInfo: null });
      }
    }
    getRunningLaunchersInfo(t) {
      try {
        if (!e(this, G)[G]) throw new Error("Event Player: no recording");
        const n = e(this, G)[G].startTime + e(this, R)[R],
          r = B.getEventByTypeRecent(e(this, b)[b], n, f),
          s = B.getEventByTypeRecent(e(this, b)[b], n, m),
          i = B.getEventByTypeRecent(e(this, b)[b], n, v),
          a = [];
        s && (!i || s.time > i.time)
          ? a.push(s.data.info)
          : r && (!i || r.time > i.time) && a.push(r.data),
          t({ success: !0, launchers: a });
      } catch (n) {
        console.warn(n), t({ success: !1, error: String(n), launchers: [] });
      }
    }
    setGameRequiredFeatures(t) {
      try {
        if (!e(this, G)[G]) throw new Error("Event Player: no recording");
        const n = e(this, G)[G].startTime + e(this, R)[R] - 2e4,
          r = B.getEventByTypeAfter(e(this, b)[b], n, l);
        if (!r) throw new Error("Event Player: features set not found");
        t(r.data);
      } catch (n) {
        console.warn(n),
          t({ success: !1, error: String(n), supportedFeatures: [] });
      }
    }
    setLauncherRequiredFeatures(t) {
      try {
        if (!e(this, G)[G]) throw new Error("Event Player: no recording");
        const n = e(this, G)[G].startTime + e(this, R)[R] - 2e4,
          r = B.getEventByTypeAfter(e(this, b)[b], n, g);
        if (!r)
          throw new Error("Event Player: launcher features set not found");
        t(r.data);
      } catch (n) {
        console.warn(n),
          t({ success: !1, error: String(n), supportedFeatures: [] });
      }
    }
    static getEventByTypeRecent(e, t, n) {
      for (let r = e.length - 1; r >= 0; r--) {
        const [s, i] = e[r];
        if (s <= t && n(i)) return i;
      }
      return null;
    }
    static getEventByTypeAfter(e, t, n) {
      const r = e.length;
      for (let s = 0; s < r; s++) {
        const [r, i] = e[s];
        if (r > t && n(i)) return i;
      }
      return null;
    }
  }
  function W() {
    null !== e(this, T)[T] &&
      (window.clearTimeout(e(this, T)[T]), (e(this, T)[T] = null));
  }
  function x() {
    if (!e(this, G)[G] || !e(this, U)[U]) return;
    const t = Date.now();
    null !== e(this, T)[T] && window.clearTimeout(e(this, T)[T]),
      (e(this, T)[T] = window.setTimeout(() => {
        e(this, q)[q](t);
      }, 10));
  }
  function A(t) {
    if (!e(this, G)[G] || !e(this, U)[U]) return;
    const n = Date.now(),
      r = Math.round((n - t) * e(this, F)[F]),
      s = e(this, R)[R],
      i = this.recordingLength,
      a = s + r;
    if (e(this, R)[R] >= i) return (e(this, R)[R] = i), void this.pause();
    e(this, S)[S]++,
      (e(this, R)[R] = a),
      e(this, M)[M](s, a),
      e(this, S)[S] % 10 === 0 && this.emit("seek", e(this, R)[R]),
      e(this, N)[N]();
  }
  function D(t, n) {
    if (!e(this, G)[G]) return;
    const r = e(this, G)[G].startTime + t,
      s = e(this, G)[G].startTime + n,
      i = e(this, b)
        [b].filter(([e]) => e >= r && e < s)
        .map(([, e]) => e);
    i.length > 0 && this.emit("playFrames", i);
  }
  var J = n("getList");
  class _ {
    constructor() {
      Object.defineProperty(this, J, { value: H });
    }
    async getHeaders() {
      const t = await e(this, J)[J]();
      if (0 === t.length) return [];
      const n = [];
      for (const e of t) {
        const t = await this.getHeader(e);
        t && n.push(t);
      }
      return n.sort((e, t) => t.startTime - e.startTime);
    }
    async getRecording(e) {
      const t = await this.getHeader(e);
      if (t) {
        const n = await this.getTimeline(e);
        if (n) return { ...t, timeline: n };
      }
      return null;
    }
    async getHeader(e) {
      const t = await fetch(_.getOWFilePath(e, h));
      return t.ok ? t.json().catch((e) => (console.error(e), null)) : null;
    }
    async getTimeline(e) {
      const t = await fetch(_.getOWFilePath(e, "timeline.json"));
      return t.ok ? t.json().catch((e) => (console.error(e), null)) : null;
    }
    static getDirPath(e) {
      return o + u + e;
    }
    static getOWFilePath(e, t) {
      return "overwolf-fs://" + _.getFilePath(e, t);
    }
    static getFilePath(e, t) {
      return o + u + e + "/" + t;
    }
  }
  async function H() {
    const e = await ((t = o), new Promise((e) => overwolf.io.dir(t, e)));
    var t;
    return e.success && e.data
      ? e.data
          .filter((e) => "dir" === e.type && e.name.startsWith(u))
          .map((e) =>
            e.name
              .replaceAll("\\", "/")
              .replace(o, "")
              .replace(u, "")
              .replace(`/${h}`, "")
          )
      : [];
  }
  var $ = n("api"),
    z = n("player"),
    C = n("rr"),
    K = n("messageID"),
    Q = n("start"),
    V = n("isStartWindow"),
    X = n("getStartWindowName"),
    Y = n("getCurrentWindowName"),
    Z = n("bindAPIEvents"),
    ee = n("bindPlayerEvents"),
    te = n("playFrames"),
    ne = n("emitPlayerUpdate"),
    re = n("sendMessageToServer"),
    se = n("bindServerMessages"),
    ie = n("handleServerMessage"),
    ae = n("playerLoad");
  async function oe() {
    console.log("Event Player: starting"),
      e(this, $)[$].replace(),
      e(this, Z)[Z](),
      e(this, ee)[ee](),
      console.log("Event Player: sync ready"),
      (await e(this, V)[V]())
        ? (await e(this, se)[se](),
          e(this, ne)[ne](),
          console.log("Event Player: ready"))
        : console.log("Event Player: not start window");
  }
  async function ue() {
    const [t, n] = await Promise.all([e(this, X)[X](), e(this, Y)[Y]()]);
    return t === n;
  }
  function he() {
    return new Promise((e, t) => {
      overwolf.extensions.current.getManifest((n) => {
        n.success ? e(n.data.start_window) : t(n.error);
      });
    });
  }
  function ce() {
    return new Promise((e, t) => {
      overwolf.windows.getCurrentWindow((n) => {
        n.success ? e(n.window.name) : t(n.error);
      });
    });
  }
  function de() {
    e(this, $)[$].on({
      getRunningGameInfo: (t) => {
        e(this, z)[z].getRunningGameInfo(t);
      },
      getRunningGameInfo2: (t) => e(this, z)[z].getRunningGameInfo2(t),
      getRunningLaunchersInfo: (t) => e(this, z)[z].getRunningLaunchersInfo(t),
      setGameRequiredFeatures: (t) => e(this, z)[z].setGameRequiredFeatures(t),
      setLauncherRequiredFeatures: (t) => {
        e(this, z)[z].setLauncherRequiredFeatures(t);
      },
    });
  }
  function le() {
    e(this, z)[z].on({
      unload: () => e(this, ne)[ne](),
      load: () => e(this, ne)[ne](),
      seek: () => e(this, ne)[ne](),
      playing: () => e(this, ne)[ne](),
      playFrames: (t) => e(this, te)[te](t),
    });
  }
  function fe(t) {
    for (var n of t) e(this, $)[$].fireEvent(n);
  }
  function me() {
    e(this, re)[re]({
      type: s.Update,
      loaded: e(this, z)[z].loaded,
      seek: e(this, z)[z].seek,
      playing: e(this, z)[z].playing,
    });
  }
  function ve(t) {
    const n = { messageID: e(this, K)[K]++, version: 2, ...t };
    overwolf.extensions.setInfo(n);
  }
  async function ge() {
    await new Promise((t, n) => {
      overwolf.extensions.registerInfo(
        "fibomngcacbbghgcjjlolojddapoipoaafjlgpoc",
        (t) => e(this, ie)[ie](t),
        (e) => (e.success ? t() : n(e.error))
      );
    });
  }
  function pe(t) {
    if (t.isRunning && "object" === typeof t.info && null !== t.info) {
      const n = t.info;
      if (2 !== n.version)
        return void console.log(
          "Event Player: #handleServerMessage(): version mismatch:",
          n.version,
          "!=",
          2
        );
      n.type === i.Load
        ? e(this, ae)[ae](n.recordingUID, n.settings)
        : !(function (e) {
              return e.type === i.Play;
            })(n)
          ? !(function (e) {
              return e.type === i.Pause;
            })(n)
            ? !(function (e) {
                return e.type === i.SetSeek;
              })(n)
              ? (function (e) {
                  return e.type === i.SetSettings;
                })(n) && e(this, z)[z].setSettings(n.settings)
              : e(this, z)[z].setSeek(n.seek)
            : e(this, z)[z].pause()
          : e(this, z)[z].play();
    }
  }
  async function ye(t, n) {
    e(this, z)[z].unload();
    const r = await e(this, C)[C].getRecording(t);
    r && e(this, z)[z].load(r, n);
  }
  new (class {
    constructor() {
      Object.defineProperty(this, ae, { value: ye }),
        Object.defineProperty(this, ie, { value: pe }),
        Object.defineProperty(this, se, { value: ge }),
        Object.defineProperty(this, re, { value: ve }),
        Object.defineProperty(this, ne, { value: me }),
        Object.defineProperty(this, te, { value: fe }),
        Object.defineProperty(this, ee, { value: le }),
        Object.defineProperty(this, Z, { value: de }),
        Object.defineProperty(this, Y, { value: ce }),
        Object.defineProperty(this, X, { value: he }),
        Object.defineProperty(this, V, { value: ue }),
        Object.defineProperty(this, Q, { value: oe }),
        Object.defineProperty(this, $, { writable: !0, value: new E() }),
        Object.defineProperty(this, z, { writable: !0, value: new B() }),
        Object.defineProperty(this, C, { writable: !0, value: new _() }),
        Object.defineProperty(this, K, { writable: !0, value: 0 });
    }
    async start() {
      try {
        await e(this, Q)[Q]();
      } catch (t) {
        console.log("Event Player: start(): error:"), console.error(t);
      }
    }
  })().start();
})();
//# sourceMappingURL=player.js.map
