let F = {};
function D(e = {}) {
  F = {
    animate: !0,
    allowClose: !0,
    overlayClickBehavior: "close",
    overlayOpacity: 0.7,
    smoothScroll: !1,
    disableActiveInteraction: !1,
    showProgress: !1,
    stagePadding: 10,
    stageRadius: 5,
    popoverOffset: 10,
    showButtons: ["next", "previous", "close"],
    disableButtons: [],
    overlayColor: "#000",
    ...e
  };
}
function s(e) {
  return e ? F[e] : F;
}
function W(e, o, t, i) {
  return (e /= i / 2) < 1 ? t / 2 * e * e + o : -t / 2 * (--e * (e - 2) - 1) + o;
}
function Z(e) {
  const o = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
  return e.flatMap((t) => {
    const i = t.matches(o), d = Array.from(t.querySelectorAll(o));
    return [...i ? [t] : [], ...d];
  }).filter((t) => getComputedStyle(t).pointerEvents !== "none" && ce(t));
}
function G(e) {
  if (!e || ae(e))
    return;
  const o = s("smoothScroll");
  e.scrollIntoView({
    // Removing the smooth scrolling for elements which exist inside the scrollable parent
    // This was causing the highlight to not properly render
    behavior: !o || se(e) ? "auto" : "smooth",
    inline: "center",
    block: "center"
  });
}
function se(e) {
  if (!e || !e.parentElement)
    return;
  const o = e.parentElement;
  return o.scrollHeight > o.clientHeight;
}
function ae(e) {
  const o = e.getBoundingClientRect();
  return o.top >= 0 && o.left >= 0 && o.bottom <= (window.innerHeight || document.documentElement.clientHeight) && o.right <= (window.innerWidth || document.documentElement.clientWidth);
}
function ce(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
let O = {};
function x(e, o) {
  O[e] = o;
}
function c(e) {
  return e ? O[e] : O;
}
function K() {
  O = {};
}
let R = {};
function N(e, o) {
  R[e] = o;
}
function _(e) {
  var o;
  (o = R[e]) == null || o.call(R);
}
function le() {
  R = {};
}
function de(e, o, t, i) {
  let d = c("__activeStagePosition");
  const n = d || t.getBoundingClientRect(), h = i.getBoundingClientRect(), m = W(e, n.x, h.x - n.x, o), r = W(e, n.y, h.y - n.y, o), v = W(e, n.width, h.width - n.width, o), g = W(e, n.height, h.height - n.height, o);
  d = {
    x: m,
    y: r,
    width: v,
    height: g
  }, U(d), x("__activeStagePosition", d);
}
function J(e) {
  if (!e)
    return;
  const o = e.getBoundingClientRect(), t = {
    x: o.x,
    y: o.y,
    width: o.width,
    height: o.height
  };
  x("__activeStagePosition", t), U(t);
}
function pe() {
  const e = c("__activeStagePosition"), o = c("__overlaySvg");
  if (!e)
    return;
  if (!o) {
    console.warn("No stage svg found.");
    return;
  }
  const t = window.innerWidth, i = window.innerHeight;
  o.setAttribute("viewBox", `0 0 ${t} ${i}`);
}
function ue(e) {
  const o = ve(e);
  document.body.appendChild(o), oe(o, (t) => {
    t.target.tagName === "path" && _("overlayClick");
  }), x("__overlaySvg", o);
}
function U(e) {
  const o = c("__overlaySvg");
  if (!o) {
    ue(e);
    return;
  }
  const t = o.firstElementChild;
  if ((t == null ? void 0 : t.tagName) !== "path")
    throw new Error("no path element found in stage svg");
  t.setAttribute("d", ee(e));
}
function ve(e) {
  const o = window.innerWidth, t = window.innerHeight, i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  i.classList.add("driver-overlay", "driver-overlay-animated"), i.setAttribute("viewBox", `0 0 ${o} ${t}`), i.setAttribute("xmlSpace", "preserve"), i.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink"), i.setAttribute("version", "1.1"), i.setAttribute("preserveAspectRatio", "xMinYMin slice"), i.style.fillRule = "evenodd", i.style.clipRule = "evenodd", i.style.strokeLinejoin = "round", i.style.strokeMiterlimit = "2", i.style.zIndex = "10000", i.style.position = "fixed", i.style.top = "0", i.style.left = "0", i.style.width = "100%", i.style.height = "100%";
  const d = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", ee(e)), d.style.fill = s("overlayColor") || "rgb(0,0,0)", d.style.opacity = `${s("overlayOpacity")}`, d.style.pointerEvents = "auto", d.style.cursor = "auto", i.appendChild(d), i;
}
function ee(e) {
  const o = window.innerWidth, t = window.innerHeight, i = s("stagePadding") || 0, d = s("stageRadius") || 0, n = e.width + i * 2, h = e.height + i * 2, m = Math.min(d, n / 2, h / 2), r = Math.floor(Math.max(m, 0)), v = e.x - i + r, g = e.y - i, a = n - r * 2, l = h - r * 2;
  return `M${o},0L0,0L0,${t}L${o},${t}L${o},0Z
    M${v},${g} h${a} a${r},${r} 0 0 1 ${r},${r} v${l} a${r},${r} 0 0 1 -${r},${r} h-${a} a${r},${r} 0 0 1 -${r},-${r} v-${l} a${r},${r} 0 0 1 ${r},-${r} z`;
}
function fe() {
  const e = c("__overlaySvg");
  e && e.remove();
}
function he() {
  const e = document.getElementById("driver-dummy-element");
  if (e)
    return e;
  let o = document.createElement("div");
  return o.id = "driver-dummy-element", o.style.width = "0", o.style.height = "0", o.style.pointerEvents = "none", o.style.opacity = "0", o.style.position = "fixed", o.style.top = "50%", o.style.left = "50%", document.body.appendChild(o), o;
}
function X(e) {
  const { element: o } = e;
  let t = typeof o == "string" ? document.querySelector(o) : o;
  t || (t = he()), we(t, e);
}
function ge() {
  const e = c("__activeElement"), o = c("__activeStep");
  e && (J(e), pe(), ne(e, o));
}
function we(e, o) {
  const i = Date.now(), d = c("__activeStep"), n = c("__activeElement") || e, h = !n || n === e, m = e.id === "driver-dummy-element", r = n.id === "driver-dummy-element", v = s("animate"), g = o.onHighlightStarted || s("onHighlightStarted"), a = (o == null ? void 0 : o.onHighlighted) || s("onHighlighted"), l = (d == null ? void 0 : d.onDeselected) || s("onDeselected"), p = s(), w = c();
  !h && l && l(r ? void 0 : n, d, {
    config: p,
    state: w
  }), g && g(m ? void 0 : e, o, {
    config: p,
    state: w
  });
  const u = !h && v;
  let f = !1;
  Ce(), x("previousStep", d), x("previousElement", n), x("activeStep", o), x("activeElement", e);
  const C = () => {
    if (c("__transitionCallback") !== C)
      return;
    const P = Date.now() - i, b = 400 - P <= 400 / 2;
    o.popover && b && !f && u && (Y(e, o), f = !0), s("animate") && P < 400 ? de(P, 400, n, e) : (J(e), a && a(m ? void 0 : e, o, {
      config: s(),
      state: c()
    }), x("__transitionCallback", void 0), x("__previousStep", d), x("__previousElement", n), x("__activeStep", o), x("__activeElement", e)), window.requestAnimationFrame(C);
  };
  x("__transitionCallback", C), window.requestAnimationFrame(C), G(e), !u && o.popover && Y(e, o), n.classList.remove("driver-active-element", "driver-no-interaction"), n.removeAttribute("aria-haspopup"), n.removeAttribute("aria-expanded"), n.removeAttribute("aria-controls"), s("disableActiveInteraction") && e.classList.add("driver-no-interaction"), e.classList.add("driver-active-element"), e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "true"), e.setAttribute("aria-controls", "driver-popover-content");
}
function me() {
  var e;
  (e = document.getElementById("driver-dummy-element")) == null || e.remove(), document.querySelectorAll(".driver-active-element").forEach((o) => {
    o.classList.remove("driver-active-element", "driver-no-interaction"), o.removeAttribute("aria-haspopup"), o.removeAttribute("aria-expanded"), o.removeAttribute("aria-controls");
  });
}
function I() {
  const e = c("__resizeTimeout");
  e && window.cancelAnimationFrame(e), x("__resizeTimeout", window.requestAnimationFrame(ge));
}
function ye(e) {
  var r;
  if (!c("isInitialized") || !(e.key === "Tab" || e.keyCode === 9))
    return;
  const i = c("__activeElement"), d = (r = c("popover")) == null ? void 0 : r.wrapper, n = Z([
    ...d ? [d] : [],
    ...i ? [i] : []
  ]), h = n[0], m = n[n.length - 1];
  if (e.preventDefault(), e.shiftKey) {
    const v = n[n.indexOf(document.activeElement) - 1] || m;
    v == null || v.focus();
  } else {
    const v = n[n.indexOf(document.activeElement) + 1] || h;
    v == null || v.focus();
  }
}
function te(e) {
  var t;
  ((t = s("allowKeyboardControl")) == null || t) && (e.key === "Escape" ? _("escapePress") : e.key === "ArrowRight" ? _("arrowRightPress") : e.key === "ArrowLeft" && _("arrowLeftPress"));
}
function oe(e, o, t) {
  const i = (n, h) => {
    const m = n.target;
    e.contains(m) && ((!t || t(m)) && (n.preventDefault(), n.stopPropagation(), n.stopImmediatePropagation()), h == null || h(n));
  };
  document.addEventListener("pointerdown", i, !0), document.addEventListener("mousedown", i, !0), document.addEventListener("pointerup", i, !0), document.addEventListener("mouseup", i, !0), document.addEventListener(
    "click",
    (n) => {
      i(n, o);
    },
    !0
  );
}
function be() {
  window.addEventListener("keyup", te, !1), window.addEventListener("keydown", ye, !1), window.addEventListener("resize", I), window.addEventListener("scroll", I);
}
function xe() {
  window.removeEventListener("keyup", te), window.removeEventListener("resize", I), window.removeEventListener("scroll", I);
}
function Ce() {
  const e = c("popover");
  e && (e.wrapper.style.display = "none");
}
function Y(e, o) {
  var y, b;
  let t = c("popover");
  t && document.body.removeChild(t.wrapper), t = Pe(), document.body.appendChild(t.wrapper);
  const {
    title: i,
    description: d,
    showButtons: n,
    disableButtons: h,
    showProgress: m,
    nextBtnText: r = s("nextBtnText") || "Next &rarr;",
    prevBtnText: v = s("prevBtnText") || "&larr; Previous",
    progressText: g = s("progressText") || "{current} of {total}"
  } = o.popover || {};
  t.nextButton.innerHTML = r, t.previousButton.innerHTML = v, t.progress.innerHTML = g, i ? (t.title.innerHTML = i, t.title.style.display = "block") : t.title.style.display = "none", d ? (t.description.innerHTML = d, t.description.style.display = "block") : t.description.style.display = "none";
  const a = n || s("showButtons"), l = m || s("showProgress") || !1, p = (a == null ? void 0 : a.includes("next")) || (a == null ? void 0 : a.includes("previous")) || l;
  t.closeButton.style.display = a.includes("close") ? "block" : "none", p ? (t.footer.style.display = "flex", t.progress.style.display = l ? "block" : "none", t.nextButton.style.display = a.includes("next") ? "block" : "none", t.previousButton.style.display = a.includes("previous") ? "block" : "none") : t.footer.style.display = "none";
  const w = h || s("disableButtons") || [];
  w != null && w.includes("next") && (t.nextButton.disabled = !0, t.nextButton.classList.add("driver-popover-btn-disabled")), w != null && w.includes("previous") && (t.previousButton.disabled = !0, t.previousButton.classList.add("driver-popover-btn-disabled")), w != null && w.includes("close") && (t.closeButton.disabled = !0, t.closeButton.classList.add("driver-popover-btn-disabled"));
  const u = t.wrapper;
  u.style.display = "block", u.style.left = "", u.style.top = "", u.style.bottom = "", u.style.right = "", u.id = "driver-popover-content", u.setAttribute("role", "dialog"), u.setAttribute("aria-labelledby", "driver-popover-title"), u.setAttribute("aria-describedby", "driver-popover-description");
  const f = t.arrow;
  f.className = "driver-popover-arrow";
  const C = ((y = o.popover) == null ? void 0 : y.popoverClass) || s("popoverClass") || "";
  u.className = `driver-popover ${C}`.trim(), oe(
    t.wrapper,
    (S) => {
      var $, B, M;
      const T = S.target, E = (($ = o.popover) == null ? void 0 : $.onNextClick) || s("onNextClick"), A = ((B = o.popover) == null ? void 0 : B.onPrevClick) || s("onPrevClick"), H = ((M = o.popover) == null ? void 0 : M.onCloseClick) || s("onCloseClick");
      if (T.classList.contains("driver-popover-next-btn"))
        return E ? E(e, o, {
          config: s(),
          state: c()
        }) : _("nextClick");
      if (T.classList.contains("driver-popover-prev-btn"))
        return A ? A(e, o, {
          config: s(),
          state: c()
        }) : _("prevClick");
      if (T.classList.contains("driver-popover-close-btn"))
        return H ? H(e, o, {
          config: s(),
          state: c()
        }) : _("closeClick");
    },
    (S) => !(t != null && t.description.contains(S)) && !(t != null && t.title.contains(S)) && typeof S.className == "string" && S.className.includes("driver-popover")
  ), x("popover", t);
  const k = ((b = o.popover) == null ? void 0 : b.onPopoverRender) || s("onPopoverRender");
  k && k(t, {
    config: s(),
    state: c()
  }), ne(e, o), G(u);
  const L = e.classList.contains("driver-dummy-element"), P = Z([u, ...L ? [] : [e]]);
  P.length > 0 && P[0].focus();
}
function ie() {
  const e = c("popover");
  if (!(e != null && e.wrapper))
    return;
  const o = e.wrapper.getBoundingClientRect(), t = s("stagePadding") || 0, i = s("popoverOffset") || 0;
  return {
    width: o.width + t + i,
    height: o.height + t + i,
    realWidth: o.width,
    realHeight: o.height
  };
}
function j(e, o) {
  const { elementDimensions: t, popoverDimensions: i, popoverPadding: d, popoverArrowDimensions: n } = o;
  return e === "start" ? Math.max(
    Math.min(
      t.top - d,
      window.innerHeight - i.realHeight - n.width
    ),
    n.width
  ) : e === "end" ? Math.max(
    Math.min(
      t.top - (i == null ? void 0 : i.realHeight) + t.height + d,
      window.innerHeight - (i == null ? void 0 : i.realHeight) - n.width
    ),
    n.width
  ) : e === "center" ? Math.max(
    Math.min(
      t.top + t.height / 2 - (i == null ? void 0 : i.realHeight) / 2,
      window.innerHeight - (i == null ? void 0 : i.realHeight) - n.width
    ),
    n.width
  ) : 0;
}
function Q(e, o) {
  const { elementDimensions: t, popoverDimensions: i, popoverPadding: d, popoverArrowDimensions: n } = o;
  return e === "start" ? Math.max(
    Math.min(
      t.left - d,
      window.innerWidth - i.realWidth - n.width
    ),
    n.width
  ) : e === "end" ? Math.max(
    Math.min(
      t.left - (i == null ? void 0 : i.realWidth) + t.width + d,
      window.innerWidth - (i == null ? void 0 : i.realWidth) - n.width
    ),
    n.width
  ) : e === "center" ? Math.max(
    Math.min(
      t.left + t.width / 2 - (i == null ? void 0 : i.realWidth) / 2,
      window.innerWidth - (i == null ? void 0 : i.realWidth) - n.width
    ),
    n.width
  ) : 0;
}
function ne(e, o) {
  const t = c("popover");
  if (!t)
    return;
  const { align: i = "start", side: d = "left" } = (o == null ? void 0 : o.popover) || {}, n = i, h = e.id === "driver-dummy-element" ? "over" : d, m = s("stagePadding") || 0, r = ie(), v = t.arrow.getBoundingClientRect(), g = e.getBoundingClientRect(), a = g.top - r.height;
  let l = a >= 0;
  const p = window.innerHeight - (g.bottom + r.height);
  let w = p >= 0;
  const u = g.left - r.width;
  let f = u >= 0;
  const C = window.innerWidth - (g.right + r.width);
  let k = C >= 0;
  const L = !l && !w && !f && !k;
  let P = h;
  if (h === "top" && l ? k = f = w = !1 : h === "bottom" && w ? k = f = l = !1 : h === "left" && f ? k = l = w = !1 : h === "right" && k && (f = l = w = !1), h === "over") {
    const y = window.innerWidth / 2 - r.realWidth / 2, b = window.innerHeight / 2 - r.realHeight / 2;
    t.wrapper.style.left = `${y}px`, t.wrapper.style.right = "auto", t.wrapper.style.top = `${b}px`, t.wrapper.style.bottom = "auto";
  } else if (L) {
    const y = window.innerWidth / 2 - (r == null ? void 0 : r.realWidth) / 2, b = 10;
    t.wrapper.style.left = `${y}px`, t.wrapper.style.right = "auto", t.wrapper.style.bottom = `${b}px`, t.wrapper.style.top = "auto";
  } else if (f) {
    const y = Math.min(
      u,
      window.innerWidth - (r == null ? void 0 : r.realWidth) - v.width
    ), b = j(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: m,
      popoverArrowDimensions: v
    });
    t.wrapper.style.left = `${y}px`, t.wrapper.style.top = `${b}px`, t.wrapper.style.bottom = "auto", t.wrapper.style.right = "auto", P = "left";
  } else if (k) {
    const y = Math.min(
      C,
      window.innerWidth - (r == null ? void 0 : r.realWidth) - v.width
    ), b = j(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: m,
      popoverArrowDimensions: v
    });
    t.wrapper.style.right = `${y}px`, t.wrapper.style.top = `${b}px`, t.wrapper.style.bottom = "auto", t.wrapper.style.left = "auto", P = "right";
  } else if (l) {
    const y = Math.min(
      a,
      window.innerHeight - r.realHeight - v.width
    );
    let b = Q(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: m,
      popoverArrowDimensions: v
    });
    t.wrapper.style.top = `${y}px`, t.wrapper.style.left = `${b}px`, t.wrapper.style.bottom = "auto", t.wrapper.style.right = "auto", P = "top";
  } else if (w) {
    const y = Math.min(
      p,
      window.innerHeight - (r == null ? void 0 : r.realHeight) - v.width
    );
    let b = Q(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: m,
      popoverArrowDimensions: v
    });
    t.wrapper.style.left = `${b}px`, t.wrapper.style.bottom = `${y}px`, t.wrapper.style.top = "auto", t.wrapper.style.right = "auto", P = "bottom";
  }
  L ? t.arrow.classList.add("driver-popover-arrow-none") : ke(n, P, e);
}
function ke(e, o, t) {
  const i = c("popover");
  if (!i)
    return;
  const d = t.getBoundingClientRect(), n = ie(), h = i.arrow, m = n.width, r = window.innerWidth, v = d.width, g = d.left, a = n.height, l = window.innerHeight, p = d.top, w = d.height;
  h.className = "driver-popover-arrow";
  let u = o, f = e;
  o === "top" ? (g + v <= 0 ? (u = "right", f = "end") : g + v - m <= 0 && (u = "top", f = "start"), g >= r ? (u = "left", f = "end") : g + m >= r && (u = "top", f = "end")) : o === "bottom" ? (g + v <= 0 ? (u = "right", f = "start") : g + v - m <= 0 && (u = "bottom", f = "start"), g >= r ? (u = "left", f = "start") : g + m >= r && (u = "bottom", f = "end")) : o === "left" ? (p + w <= 0 ? (u = "bottom", f = "end") : p + w - a <= 0 && (u = "left", f = "start"), p >= l ? (u = "top", f = "end") : p + a >= l && (u = "left", f = "end")) : o === "right" && (p + w <= 0 ? (u = "bottom", f = "start") : p + w - a <= 0 && (u = "right", f = "start"), p >= l ? (u = "top", f = "start") : p + a >= l && (u = "right", f = "end")), u ? (h.classList.add(`driver-popover-arrow-side-${u}`), h.classList.add(`driver-popover-arrow-align-${f}`)) : h.classList.add("driver-popover-arrow-none");
}
function Pe() {
  const e = document.createElement("div");
  e.classList.add("driver-popover");
  const o = document.createElement("div");
  o.classList.add("driver-popover-arrow");
  const t = document.createElement("header");
  t.id = "driver-popover-title", t.classList.add("driver-popover-title"), t.style.display = "none", t.innerText = "Popover Title";
  const i = document.createElement("div");
  i.id = "driver-popover-description", i.classList.add("driver-popover-description"), i.style.display = "none", i.innerText = "Popover description is here";
  const d = document.createElement("button");
  d.type = "button", d.classList.add("driver-popover-close-btn"), d.setAttribute("aria-label", "Close"), d.innerHTML = "&times;";
  const n = document.createElement("footer");
  n.classList.add("driver-popover-footer");
  const h = document.createElement("span");
  h.classList.add("driver-popover-progress-text"), h.innerText = "";
  const m = document.createElement("span");
  m.classList.add("driver-popover-navigation-btns");
  const r = document.createElement("button");
  r.type = "button", r.classList.add("driver-popover-prev-btn"), r.innerHTML = "&larr; Previous";
  const v = document.createElement("button");
  return v.type = "button", v.classList.add("driver-popover-next-btn"), v.innerHTML = "Next &rarr;", m.appendChild(r), m.appendChild(v), n.appendChild(h), n.appendChild(m), e.appendChild(d), e.appendChild(o), e.appendChild(t), e.appendChild(i), e.appendChild(n), {
    wrapper: e,
    arrow: o,
    title: t,
    description: i,
    footer: n,
    previousButton: r,
    nextButton: v,
    closeButton: d,
    footerButtons: m,
    progress: h
  };
}
function Se() {
  var o;
  const e = c("popover");
  e && ((o = e.wrapper.parentElement) == null || o.removeChild(e.wrapper));
}
function _e(e = {}) {
  D(e);
  function o() {
    s("allowClose") && g();
  }
  function t() {
    const a = s("overlayClickBehavior");
    if (s("allowClose") && a === "close") {
      g();
      return;
    }
    a === "nextStep" && i();
  }
  function i() {
    const a = c("activeIndex"), l = s("steps") || [];
    if (typeof a == "undefined")
      return;
    const p = a + 1;
    l[p] ? v(p) : g();
  }
  function d() {
    const a = c("activeIndex"), l = s("steps") || [];
    if (typeof a == "undefined")
      return;
    const p = a - 1;
    l[p] ? v(p) : g();
  }
  function n(a) {
    (s("steps") || [])[a] ? v(a) : g();
  }
  function h() {
    var C;
    if (c("__transitionCallback"))
      return;
    const l = c("activeIndex"), p = c("__activeStep"), w = c("__activeElement");
    if (typeof l == "undefined" || typeof p == "undefined" || typeof c("activeIndex") == "undefined")
      return;
    const f = ((C = p.popover) == null ? void 0 : C.onPrevClick) || s("onPrevClick");
    if (f)
      return f(w, p, {
        config: s(),
        state: c()
      });
    d();
  }
  function m() {
    var f;
    if (c("__transitionCallback"))
      return;
    const l = c("activeIndex"), p = c("__activeStep"), w = c("__activeElement");
    if (typeof l == "undefined" || typeof p == "undefined")
      return;
    const u = ((f = p.popover) == null ? void 0 : f.onNextClick) || s("onNextClick");
    if (u)
      return u(w, p, {
        config: s(),
        state: c()
      });
    i();
  }
  function r() {
    c("isInitialized") || (x("isInitialized", !0), document.body.classList.add("driver-active", s("animate") ? "driver-fade" : "driver-simple"), be(), N("overlayClick", t), N("escapePress", o), N("arrowLeftPress", h), N("arrowRightPress", m));
  }
  function v(a = 0) {
    var A, H, $, B, M, z, q, V;
    const l = s("steps");
    if (!l) {
      console.error("No steps to drive through"), g();
      return;
    }
    if (!l[a]) {
      g();
      return;
    }
    x("__activeOnDestroyed", document.activeElement), x("activeIndex", a);
    const p = l[a], w = l[a + 1], u = l[a - 1], f = ((A = p.popover) == null ? void 0 : A.doneBtnText) || s("doneBtnText") || "Done", C = s("allowClose"), k = typeof ((H = p.popover) == null ? void 0 : H.showProgress) != "undefined" ? ($ = p.popover) == null ? void 0 : $.showProgress : s("showProgress"), P = (((B = p.popover) == null ? void 0 : B.progressText) || s("progressText") || "{{current}} of {{total}}").replace("{{current}}", `${a + 1}`).replace("{{total}}", `${l.length}`), y = ((M = p.popover) == null ? void 0 : M.showButtons) || s("showButtons"), b = [
      "next",
      "previous",
      ...C ? ["close"] : []
    ].filter((re) => !(y != null && y.length) || y.includes(re)), S = ((z = p.popover) == null ? void 0 : z.onNextClick) || s("onNextClick"), T = ((q = p.popover) == null ? void 0 : q.onPrevClick) || s("onPrevClick"), E = ((V = p.popover) == null ? void 0 : V.onCloseClick) || s("onCloseClick");
    X({
      ...p,
      popover: {
        showButtons: b,
        nextBtnText: w ? void 0 : f,
        disableButtons: [...u ? [] : ["previous"]],
        showProgress: k,
        progressText: P,
        onNextClick: S || (() => {
          w ? v(a + 1) : g();
        }),
        onPrevClick: T || (() => {
          v(a - 1);
        }),
        onCloseClick: E || (() => {
          g();
        }),
        ...(p == null ? void 0 : p.popover) || {}
      }
    });
  }
  function g(a = !0) {
    const l = c("__activeElement"), p = c("__activeStep"), w = c("__activeOnDestroyed"), u = s("onDestroyStarted");
    if (a && u) {
      const k = !l || (l == null ? void 0 : l.id) === "driver-dummy-element";
      u(k ? void 0 : l, p, {
        config: s(),
        state: c()
      });
      return;
    }
    const f = (p == null ? void 0 : p.onDeselected) || s("onDeselected"), C = s("onDestroyed");
    if (document.body.classList.remove("driver-active", "driver-fade", "driver-simple"), xe(), Se(), me(), fe(), le(), K(), l && p) {
      const k = l.id === "driver-dummy-element";
      f && f(k ? void 0 : l, p, {
        config: s(),
        state: c()
      }), C && C(k ? void 0 : l, p, {
        config: s(),
        state: c()
      });
    }
    w && w.focus();
  }
  return {
    isActive: () => c("isInitialized") || !1,
    refresh: I,
    drive: (a = 0) => {
      r(), v(a);
    },
    setConfig: D,
    setSteps: (a) => {
      K(), D({
        ...s(),
        steps: a
      });
    },
    getConfig: s,
    getState: c,
    getActiveIndex: () => c("activeIndex"),
    isFirstStep: () => c("activeIndex") === 0,
    isLastStep: () => {
      const a = s("steps") || [], l = c("activeIndex");
      return l !== void 0 && l === a.length - 1;
    },
    getActiveStep: () => c("activeStep"),
    getActiveElement: () => c("activeElement"),
    getPreviousElement: () => c("previousElement"),
    getPreviousStep: () => c("previousStep"),
    moveNext: i,
    movePrevious: d,
    moveTo: n,
    hasNextStep: () => {
      const a = s("steps") || [], l = c("activeIndex");
      return l !== void 0 && a[l + 1];
    },
    hasPreviousStep: () => {
      const a = s("steps") || [], l = c("activeIndex");
      return l !== void 0 && a[l - 1];
    },
    highlight: (a) => {
      r(), X({
        ...a,
        popover: a.popover ? {
          showButtons: [],
          showProgress: !1,
          progressText: "",
          ...a.popover
        } : void 0
      });
    },
    destroy: () => {
      g(!1);
    }
  };
}
export {
  _e as driver
};
