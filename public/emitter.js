function mixin(e, s) {
    for (var t in s)
        s.hasOwnProperty(t) && (e[t] = s[t])
}
function EventEmitter() {
    this._events = {}
}
EventEmitter.prototype.on = function(e, s) {
    this._events.hasOwnProperty(e) || (this._events[e] = []),
    this._events[e].push(s)
}
,
EventEmitter.prototype.off = function(e, s) {
    if (this._events.hasOwnProperty(e)) {
        var t = this._events[e].indexOf(s);
        t < 0 || this._events[e].splice(t, 1)
    }
}
,
EventEmitter.prototype.emit = function(e) {
    if (this._events.hasOwnProperty(e)) {
        var s = this._events[e].slice(0);
        if (!(s.length < 1))
            for (var t = Array.prototype.slice.call(arguments, 1), r = 0; r < s.length; r++)
                s[r].apply(this, t)
    }
}
;
function hashFnv32a(e, s, t) {
    var r, h, a = t === void 0 ? 2166136261 : t;
    for (r = 0,
    h = e.length; r < h; r++)
        a ^= e.charCodeAt(r),
        a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
    return s ? ("0000000" + (a >>> 0).toString(16)).substr(-8) : a >>> 0
}
function round(e, s, t) {
    return Math.round((e - t) / s) * s + t
}
var Knob = function(e, s, t, r, h, a, v) {
    EventEmitter.call(this),
    this.min = s || 0,
    this.max = t || 10,
    this.step = r || .01,
    this.value = h || this.min,
    this.knobValue = (this.value - this.min) / (this.max - this.min),
    this.name = a || "",
    this.unit = v || "";
    var g = r.toString().indexOf(".");
    g == -1 && (g = r.toString().length - 1),
    this.fixedPoint = r.toString().substr(g).length - 1,
    this.dragY = 0,
    this.mouse_over = !1,
    this.canvas = e,
    this.ctx = e.getContext("2d"),
    this.radius = this.canvas.width * .3333,
    this.baseImage = document.createElement("canvas"),
    this.baseImage.width = e.width,
    this.baseImage.height = e.height;
    var l = this.baseImage.getContext("2d");
    l.fillStyle = "#444",
    l.shadowColor = "rgba(0, 0, 0, 0.5)",
    l.shadowBlur = 5,
    l.shadowOffsetX = this.canvas.width * .02,
    l.shadowOffsetY = this.canvas.width * .02,
    l.beginPath(),
    l.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, Math.PI * 2),
    l.fill();
    var n = this
      , c = !1;
    (function() {
        function o(d) {
            if (d.screenY !== n.dragY) {
                var w = -(d.screenY - n.dragY)
                  , W = .0075;
                d.ctrlKey && (W *= .05),
                n.setKnobValue(n.knobValue + w * W),
                n.dragY = d.screenY,
                n.redraw()
            }
            d.preventDefault(),
            u()
        }
        function f(d) {
            d.toElement === null && d.relatedTarget === null && m()
        }
        function m() {
            document.removeEventListener("mousemove", o),
            document.removeEventListener("mouseout", f),
            document.removeEventListener("mouseup", m),
            n.emit("release", n),
            c = !1,
            n.mouse_over || p()
        }
        e.addEventListener("mousedown", function(d) {
            var w = n.translateMouseEvent(d);
            n.contains(w.x, w.y) && (c = !0,
            n.dragY = d.screenY,
            u(),
            document.addEventListener("mousemove", o),
            document.addEventListener("mouseout", f),
            document.addEventListener("mouseup", m))
        }),
        e.addEventListener("keydown", function(d) {
            d.keyCode == 38 ? (n.setValue(n.value + n.step),
            u()) : d.keyCode == 40 && (n.setValue(n.value - n.step),
            u())
        })
    }
    )();
    function u() {
        var o = document.getElementById("tooltip");
        if (!o) {
            o = document.createElement("div"),
            document.body.appendChild(o),
            o.id = "tooltip";
            var f = n.canvas.getBoundingClientRect();
            o.style.left = f.left + "px",
            o.style.top = f.bottom + "px"
        }
        o.textContent = n.name,
        n.name && (o.textContent += ": "),
        o.textContent += n.valueString() + n.unit
    }
    function p() {
        var o = document.getElementById("tooltip");
        o && o.parentElement.removeChild(o)
    }
    function _(o) {
        var f = n.translateMouseEvent(o);
        n.contains(f.x, f.y) ? (n.mouse_over = !0,
        u()) : (n.mouse_over = !1,
        c || p())
    }
    function i(o) {
        n.mouse_over = !1,
        c || p()
    }
    n.canvas.addEventListener("mousemove", _),
    n.canvas.addEventListener("mouseout", i),
    this.redraw()
};
mixin(Knob.prototype, EventEmitter.prototype),
Knob.prototype.redraw = function() {
    var e = .28 * this.canvas.width
      , s = .03 * this.canvas.width;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
    this.ctx.drawImage(this.baseImage, 0, 0);
    var t = this.knobValue;
    t *= Math.PI * 2 * .8,
    t += Math.PI / 2,
    t += Math.PI * 2 * .1;
    var r = this.canvas.width / 2
      , h = Math.cos(t) * e + r
      , a = Math.sin(t) * e + r;
    this.ctx.fillStyle = "#fff",
    this.ctx.beginPath(),
    this.ctx.arc(h, a, s, 0, Math.PI * 2),
    this.ctx.fill()
}
,
Knob.prototype.setKnobValue = function(e) {
    e < 0 ? e = 0 : e > 1 && (e = 1),
    this.knobValue = e,
    this.setValue(e * (this.max - this.min) + this.min)
}
,
Knob.prototype.setValue = function(e) {
    var s = e;
    e = round(e, this.step, this.min),
    e < this.min ? e = this.min : e > this.max && (e = this.max),
    this.value !== e && (this.value = e,
    this.knobValue = (e - this.min) / (this.max - this.min),
    this.redraw(),
    this.emit("change", this))
}
,
Knob.prototype.valueString = function() {
    return this.value.toFixed(this.fixedPoint)
}
,
Knob.prototype.contains = function(e, s) {
    return e -= this.canvas.width / 2,
    s -= this.canvas.height / 2,
    Math.sqrt(Math.pow(e, 2) + Math.pow(s, 2)) < this.radius
}
,
Knob.prototype.translateMouseEvent = function(e) {
    var s = e.target;
    return {
        x: e.clientX - s.getBoundingClientRect().left - s.clientLeft + s.scrollLeft,
        y: e.clientY - (s.getBoundingClientRect().top - s.clientTop + s.scrollTop)
    }
}
;
const url_regex = new RegExp("(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?","ig")
  , parseContent = e=>e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
  , markdownRegex = /((?:\\|)(?:\|\|.+?\|\||```.+?```|``.+?``|`.+?`|\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*|___.+?___|__.+?__|_.+?_(?:\s|$)|~~.+?~~))/g
  , getTextContent = e=>e.indexOf(">") > -1 && e.indexOf("</") > -1 && e.slice(e.indexOf(">") + 1, e.lastIndexOf("</")) || e
  , getLinkTextContent = e=>{
    const s = e.indexOf(">")
      , t = e.lastIndexOf("</")
      , r = s > t ? -1 : s;
    return (r > -1 || t > -1) && e.slice(r > -1 ? r + 1 : 0, t > -1 ? t : e.length) || e
}
  , parseUrl = e=>e.replace(url_regex, s=>{
    const t = getLinkTextContent(s);
    return `<a rel="noreferer noopener" target="_blank" class="chatLink" href="${t}">${t}</a>`
}
)
  , parseMarkdown = (e,s=t=>t)=>e.split(markdownRegex).map(t=>{
    const r = t.endsWith("~~")
      , h = t.endsWith("___")
      , a = t.endsWith("__")
      , v = t.endsWith("_")
      , g = t.endsWith("***")
      , l = t.endsWith("**")
      , n = t.endsWith("*")
      , c = t.endsWith("```")
      , u = t.endsWith("``")
      , p = t.endsWith("`")
      , _ = t.endsWith("||");
    if (t.startsWith("\\~~") && r || t.startsWith("\\___") && h || t.startsWith("\\__") && a || t.startsWith("\\_") && v || t.startsWith("\\***") && g || t.startsWith("\\**") && l || t.startsWith("\\*") && n || t.startsWith("\\```") && c || t.startsWith("\\``") && u || t.startsWith("\\`") && p || t.startsWith("\\||") && _)
        return s(t.slice(1));
    if (t.startsWith("~~") && r) {
        const i = parseMarkdown(getTextContent(t.slice(2, t.length - 2)), s);
        return i.trim().length < 1 ? t : `<del class="markdown">${i}</del>`
    } else if (t.startsWith("___") && h) {
        const i = parseMarkdown(getTextContent(t.slice(3, t.length - 3)), s);
        return i.trim().length < 1 ? t : `<em class="markdown"><u class="markdown">${i}</u></em>`
    } else if (t.startsWith("__") && a) {
        const i = parseMarkdown(getTextContent(t.slice(2, t.length - 2)), s);
        return i.trim().length < 1 ? t : `<u class="markdown">${i}</u>`
    } else if (t.startsWith("***") && g) {
        const i = parseMarkdown(getTextContent(t.slice(3, t.length - 3)), s);
        return i.trim().length < 1 ? t : `<em class="markdown"><strong class="markdown">${i}</strong></em>`
    } else if (t.startsWith("**") && l) {
        const i = parseMarkdown(getTextContent(t.slice(2, t.length - 2)), s);
        return i.trim().length < 1 ? t : `<strong class="markdown">${i}</strong>`
    } else if (t.startsWith("*") && n || t.startsWith("_") && v) {
        const i = parseMarkdown(getTextContent(t.slice(1, t.length - 1)), s);
        return i.trim().length < 1 ? t : `<em class="markdown">${i}</em>`
    } else if (t.startsWith("`") && p) {
        const i = t.startsWith("```") && c ? 3 : t.startsWith("``") && u ? 2 : 1
          , o = getTextContent(t.slice(i, t.length - i));
        return o.trim().length < 1 ? t : `<code class="markdown">${o}</code>`
    } else if (t.startsWith("||") && _) {
        const i = parseMarkdown(getTextContent(t.slice(2, t.length - 2)), s);
        return i.trim().length < 1 ? t : `<span class="markdown spoiler">${i}</span>`
    }
    return s(t)
}
).join("");
