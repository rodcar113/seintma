__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dispatcher", function() { return Dispatcher; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



const PASSIVE = {
  passive: true
};
class Dispatcher {
  constructor(manager) {
    _defineProperty(this, "_onScroll", evt => {
      if (this.manager.disabled) {
        return;
      }
      this._activateEntranceAnimationsInViewport();
      this._driveViewportDrivenAnimations(evt);
    });
    _defineProperty(this, "_onMouseOver", evt => {
      if (this.manager.disabled) {
        return;
      }
      this.manager._runAnimations(this.manager._getHoverInstancesForElement(evt.target));
    });
    _defineProperty(this, "_onMouseOut", evt => {
      if (this.manager.disabled) {
        return;
      }
      this.manager._stopAnimations(this.manager._getHoverInstancesForElement(evt.target));
    });
    _defineProperty(this, "_onMouseMove", evt => {
      if (this.manager.disabled) {
        return;
      }
      const animations = this.manager.getInstancesByTrigger(_constants__WEBPACK_IMPORTED_MODULE_0__["Driver"].MOUSE_PROXIMITY);
      animations.forEach(inst => {
        inst._seekByMouseProximity(evt);
      });
    });
    this.manager = manager;
    this.registerListeners();
    this.scrollListeners = [];
  }
  registerListeners() {
    window.addEventListener('scroll', this._onScroll, PASSIVE);
    window.addEventListener('resize', this._onScroll, PASSIVE);
    window.addEventListener('mouseover', this._onMouseOver, PASSIVE);
    window.addEventListener('mouseout', this._onMouseOut, PASSIVE);
    window.addEventListener('mousemove', this._onMouseMove, PASSIVE);
  }
  removeListeners() {
    window.removeEventListener('scroll', this._onScroll, PASSIVE);
    window.removeEventListener('resize', this._onScroll, PASSIVE);
    window.removeEventListener('mouseover', this._onMouseOver, PASSIVE);
    window.removeEventListener('mouseout', this._onMouseOut, PASSIVE);
    window.removeEventListener('mousemove', this._onMouseMove, PASSIVE);
  }
  addScrollListener(targetElement) {
    const scrollParent = targetElement.scrollParent;
    if (scrollParent === Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getDocumentScrollingElement"])()) {
      return;
    }
    this.scrollListeners.push({
      targetElement,
      scrollParent
    });
    scrollParent.addEventListener('scroll', this._onScroll, PASSIVE);
  }
  removeScrollListener(targetElement) {
    const found = this.scrollListeners.find(sl => sl.targetElement === targetElement);
    if (found) {
      const scrollParent = found.scrollParent;
      this.scrollListeners.splice(this.scrollListeners.indexOf(found), 1);
      if (!this.scrollListeners.find(sl => sl.scrollParent === scrollParent)) {
        scrollParent.removeEventListener('scroll', this._onScroll, PASSIVE);
      }
    }
  }
  _activateEntranceAnimationsInViewport() {
    let instances = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    const entranceInstances = instances || this.manager.getInstancesByTrigger(_constants__WEBPACK_IMPORTED_MODULE_0__["Trigger"].ENTRANCE);
    entranceInstances.forEach(inst => {
      if (!inst.didPlay) {
        if (this.manager.libOptions.jitAnimation) {
          inst.visibilityPriority = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["isUndefined"])(inst.visibilityPriority) ? inst.targetElement.style.getPropertyPriority('visibility') : inst.visibilityPriority;
          inst.targetElement.style.visibility = 'hidden';
          inst.seekToEnd();
        } else {
          inst.seek(0);
        }
        if (Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["isElementInViewport"])(inst.targetElement, 0, true)) {
          if (this.manager.libOptions.jitAnimation) {
            inst.seek(0);
            inst.targetElement.style.setProperty('visibility', 'visible', inst.visibilityPriority);
          }
          if (entranceInstances.length > 20) {
            requestAnimationFrame(() => inst.play());
          } else {
            inst.play();
          }
        }
      }
    });
  }
  _driveViewportDrivenAnimations(evt) {
    const viewportDrivenInstances = this.manager.getInstancesByTrigger(_constants__WEBPACK_IMPORTED_MODULE_0__["Driver"].VIEWPORT).filter(inst => {
      if (inst.targetElement.scrollParent === Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getDocumentScrollingElement"])() && [document, Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getDocumentScrollingElement"])(), window].includes(evt.target)) {
        return this.manager.libOptions.jitAnimation || Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["isElementInViewport"])(inst.targetElement, 0, true);
      } else {
        return inst.targetElement.scrollParent === evt.target;
      }
    });
    viewportDrivenInstances.forEach(inst => {
      inst._seekToViewportPosition();
    });
  }
}

//# sourceURL=webpack:///./src/Dispatcher.js?