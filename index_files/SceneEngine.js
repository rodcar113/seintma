__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SceneEngine", function() { return SceneEngine; });
/* harmony import */ var _Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Engine */ "./src/Engine.js");
/* harmony import */ var scenejs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scenejs */ "scenejs");
/* harmony import */ var scenejs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(scenejs__WEBPACK_IMPORTED_MODULE_1__);
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


class SceneEngine extends _Engine__WEBPACK_IMPORTED_MODULE_0__["Engine"] {
  static getUniqueID() {
    return (Date.now().toString(36).substr(-3) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }
  constructor(instance) {
    super(instance);
    _defineProperty(this, "onIteration", () => {
      this.instance._onIteration();
    });
    _defineProperty(this, "onTimeUpdate", () => {
      this.instance._onUpdate();
    });
    _defineProperty(this, "onEnded", () => {
      this.seek(this.getAnimation().getDuration());
      this._resetCSSAnim();
      this._removeClass();
      this._removeStyleSheet();
      this.instance._onEnd();
    });
    this.create();
  }
  create() {
    if (this.isPlaying()) {
      this.pause();
    }
    const timeline = this.instance._getTimeline();
    this.cleanElement();
    this.className = 'running-animation-' + SceneEngine.getUniqueID();
    this._addClass();
    const options = this.getAnimation().getOptions();
    this.ref = new scenejs__WEBPACK_IMPORTED_MODULE_1___default.a({
      [".".concat(this.className)]: timeline.rawTimeline
    }, {
      selector: true,
      id: this.className,
      easing: options.easing,
      direction: options.yoyo ? 'alternate' : 'normal',
      duration: this.getAnimation().getDuration(),
      iterationCount: this._shouldLoop() ? 'infinite' : 1
    });
    this.ref.on('timeupdate', this.onTimeUpdate);
    this.ref.on('iteration', this.onIteration);
    this.ref.on('ended', this.onEnded);
  }
  update() {
    this.create();
  }
  play() {
    if (this.isPlaying()) {
      return;
    } else if (this.getTime() === this.getAnimation().getDuration()) {
      this.seek(0);
    }
    this._addClass();
    this._resetCSSAnim();
    if (this._canPlayCSS()) {
      this.ref.playCSS();
    } else {
      this.ref.play();
    }
  }
  _canPlayCSS() {
    return this.getAnimation()._isAtomic && !this._shouldLoop() && !SceneEngine.cssAnimationDisabled;
  }
  static disableCSSAnimation() {
    this.cssAnimationDisabled = true;
  }
  static enableCSSAnimation() {
    this.cssAnimationDisabled = false;
  }
  pause() {
    if (this._canPlayCSS()) {
      this.ref.pauseCSS();
    } else {
      this.ref.pause();
    }
  }
  _resetCSSAnim() {
    let restore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const targetElement = this.getTargetElement();
    ['startAnimation', 'pauseAnimation'].forEach(className => {
      if (targetElement.classList.contains(className)) {
        targetElement.classList.remove(className);
      }
    });
    if (restore) {
      this.instance._restoreElementStyle();
    }
  }
  _removeStyleSheet() {
    if (!this.ref) return;
    const styleSheet = document.querySelector("#__SCENEJS_STYLE_".concat(this.ref.getId()));
    if (styleSheet) {
      styleSheet.remove();
    }
  }
  seek(time) {
    this._resetCSSAnim();
    this.ref.setTime(time);
  }
  getTime() {
    return this.ref.getTime();
  }
  isPlaying() {
    return this.ref && this.ref.getPlayState() === 'running';
  }
  kill() {
    this._resetCSSAnim(true);
    this._removeClass();
    this._removeStyleSheet();
  }
  _addClass() {
    const targetElement = this.getTargetElement();
    if (!targetElement.classList.contains(this.className)) {
      targetElement.classList.add(this.className);
    }
  }
  cleanElement() {
    this._resetCSSAnim(true);
    this._removeClass();
    this._removeStyleSheet();
  }
  _removeClass() {
    const targetElement = this.getTargetElement();
    if (targetElement.classList.contains(this.className)) {
      targetElement.classList.remove(this.className);
      if (!targetElement.classList.length) {
        targetElement.removeAttribute('class');
      }
    }
  }
}
_defineProperty(SceneEngine, "cssAnimationDisabled", true);

//# sourceURL=webpack:///./src/SceneEngine.js?