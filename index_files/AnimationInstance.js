__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationInstance", function() { return AnimationInstance; });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _StyleManipulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StyleManipulator */ "./src/StyleManipulator.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


class AnimationInstance {
  constructor(animation, targetElement, EngineClass) {
    _defineProperty(this, "didPlay", false);
    _defineProperty(this, "onFinishCallbacks", []);
    this.animation = animation;
    this.targetElement = targetElement;
    this._saveTargetElementOriginalStyle();
    if (!this.getAnimation()._getTimeline()) {
      throw 'No timeline!';
    }
    this.engine = new EngineClass(this);
  }
  getAnimation() {
    return this.animation;
  }
  reset() {
    this._recompose();
  }
  preview() {
    this.didPlay = false;
    this.seek(0);
    this.play();
  }
  play() {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
    const play = () => {
      if (this.getAnimation().getOptions().relative) {
        this._update();
      }
      this.didPlay = true;
      this.engine.play();
    };
    if (!this.didPlay && this.getAnimation().getOptions().delay) {
      this.didPlay = true;
      this.delayTimeout = setTimeout(() => {
        play();
      }, this.getAnimation().getOptions().delay * 1000);
    } else {
      play();
    }
  }
  pause() {
    this.engine.pause();
  }
  pauseOnIterationEnd() {
    this.endAtNextLoop = true;
  }
  seek(time) {
    this.engine.seek(time);
  }
  seekToEnd() {
    this.seek(this.getAnimation().getDuration());
  }
  getTime() {
    return this.engine.getTime();
  }
  isPlaying() {
    return this.engine.isPlaying();
  }
  remove() {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
    this.pause();
    this.cleanElement();
    this.engine.kill();
    this.getAnimation().manager._removeInstance(this);
  }
  separate() {
    this._replaceAnimation(this.getAnimation().clone());
    return this;
  }
  writeDescriptorToElement() {
    this.getAnimation().writeDescriptorToElement(this.targetElement);
  }
  cleanElement() {
    this._restoreElementStyle();
    this.engine.cleanElement();
  }
  whenFinished(callback) {
    if (this.isPlaying()) {
      this.onFinishCallbacks.push(callback);
    } else {
      callback();
    }
  }
  _onEnd() {
    if (!this.engine._shouldLoop()) {
      [...this.onFinishCallbacks].forEach(cb => {
        cb();
        this.onFinishCallbacks.splice(this.onFinishCallbacks.indexOf(cb), 1);
      });
    }
  }
  _recompose() {
    let overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let keepTotalLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    this.getAnimation()._recompose(overrides, keepTotalLength);
    this._replaceAnimation(this.getAnimation());
  }
  _saveTargetElementOriginalStyle() {
    this.originalElementStyle = this.targetElement.getAttribute('style');
    this.targetElement.originalElementStyle = this.originalElementStyle;
    this.targetElement.scrollParent = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getScrollParent"])(this.targetElement);
  }
  _seekToViewportPosition() {
    if (this.getAnimation().manager.libOptions.jitAnimation && !Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["isElementInViewport"])(this.targetElement, 0, true)) {
      this.seekToEnd();
    } else {
      const isDocumentLevelScroll = this.targetElement.scrollParent === Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getDocumentScrollingElement"])();
      const fullViewportHeight = isDocumentLevelScroll ? window.innerHeight : this.targetElement.scrollParent.clientHeight;
      const targetRect = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getElementOriginalBoundingRect"])(this.targetElement);
      const scrollParentRect = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getElementOriginalBoundingRect"])(this.targetElement.scrollParent);
      const targetY = isDocumentLevelScroll ? targetRect.top : targetRect.top - scrollParentRect.top;
      const thresholds = {
        ...this.getAnimation().getOptions().viewportThresholds
      };
      ['top', 'bottom'].forEach(prop => {
        if (Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["isString"])(thresholds[prop]) && thresholds[prop].endsWith('%')) {
          thresholds[prop] = parseFloat(thresholds[prop]) / 100 * fullViewportHeight;
        }
      });
      const viewportHeight = fullViewportHeight - thresholds.top - thresholds.bottom;
      const finalTargetY = Math.max(0, targetY - thresholds.top);
      const progress = Math.max(0, Math.min(1, (viewportHeight - finalTargetY) / viewportHeight));
      const t = progress * this.getAnimation().getDuration();
      this.seek(t);
    }
  }
  _seekByMouseProximity(evt) {
    const targetRect = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getElementOriginalBoundingRect"])(this.targetElement);
    const targetCenter = {
      x: (targetRect.right + targetRect.left) / 2,
      y: (targetRect.top + targetRect.bottom) / 2
    };
    const dist = Math.sqrt(Math.pow(targetCenter.x - evt.clientX, 2) + Math.pow(targetCenter.y - evt.clientY, 2));
    const threshold = this.getAnimation().getOptions().proximityThreshold;
    const t = (1 - dist / threshold) * this.getAnimation().getDuration();
    this.seek(dist < threshold ? t : 0);
  }
  _getTimeline() {
    const tl = this.getAnimation()._getTimeline();
    if (this.getAnimation().getOptions().relative) {
      const style = new _StyleManipulator__WEBPACK_IMPORTED_MODULE_1__["StyleManipulator"](this.targetElement.getAttribute('style'));
      tl.addTransform(style.toObject(false).transform);
    }
    return tl;
  }
  _update() {
    this.engine.update();
  }
  _onUpdate() {
    this._syncInnerAnimations();
  }
  _syncInnerAnimations() {
    const manager = this.getAnimation().manager;
    const innerInstances = manager._filterInstances(inst => {
      return inst.targetElement !== this.targetElement && this.targetElement.contains(inst.targetElement);
    });
    innerInstances.forEach(inst => {
      manager._syncInstance(inst);
    });
  }
  _onIteration() {
    if (this.endAtNextLoop) {
      this.pause();
      delete this.endAtNextLoop;
    }
  }
  _replaceAnimation(newAnimation) {
    this.didPlay = false;
    this.remove();
    this.getAnimation().manager._removeInstance(this);
    const alteredInstance = newAnimation.apply(this.targetElement, true);
    this.getAnimation().manager._replaceInstance(alteredInstance, this);
    this.engine = alteredInstance.engine;
    this.engine.instance = this;
    this.animation = newAnimation;
    this.getAnimation().manager._activate();
  }
  _restoreElementStyle() {
    if (this.originalElementStyle) {
      this.targetElement.setAttribute('style', this.originalElementStyle);
    } else {
      this.targetElement.removeAttribute('style');
    }
  }
}

//# sourceURL=webpack:///./src/AnimationInstance.js?