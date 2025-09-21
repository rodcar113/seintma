__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animation", function() { return Animation; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash.clonedeep */ "lodash.clonedeep");
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _Timeline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Timeline */ "./src/Timeline.js");
/* harmony import */ var _AnimationInstance__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AnimationInstance */ "./src/AnimationInstance.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





class Animation {
  constructor(manager, descriptor) {
    var _this$effect;
    _defineProperty(this, "compositionType", _constants__WEBPACK_IMPORTED_MODULE_0__["ANIMATION_COMPOSITION_TYPE"].ATOMIC);
    _defineProperty(this, "subAnimations", []);
    _defineProperty(this, "originalEffect", null);
    _defineProperty(this, "copyOf", null);
    _defineProperty(this, "descriptor", null);
    _defineProperty(this, "manager", null);
    _defineProperty(this, "autoDuration", true);
    const descriptorWithDefaults = {
      ...descriptor,
      options: {
        ..._constants__WEBPACK_IMPORTED_MODULE_0__["MASTER_DEFAULT_OPTIONS"],
        ...descriptor.options
      }
    };
    this.descriptor = descriptorWithDefaults;
    this.manager = manager;
    this.setEffect(descriptor.effect);
    const effectDefaults = ((_this$effect = this.effect) === null || _this$effect === void 0 ? void 0 : _this$effect.defaultOptions) || {};
    this.descriptor = {
      ...descriptor,
      options: {
        ..._constants__WEBPACK_IMPORTED_MODULE_0__["MASTER_DEFAULT_OPTIONS"],
        ...effectDefaults,
        ...descriptor.options
      }
    };
  }
  clone() {
    const clone = this.manager.createAnimation(lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1___default()(this.getDescriptor()));
    Animation._copy(this, clone);
    return clone;
  }
  getOptions() {
    return {
      ...this.descriptor.options
    };
  }
  getOriginal() {
    if (!this.copyOf) {
      return this;
    } else {
      return this.copyOf.getOriginal();
    }
  }
  getDelay() {
    return this.getOptions().delay;
  }
  getDuration() {
    const ownDuration = this.getOptions().duration;
    if (this._isAtomic || ownDuration !== 'auto') {
      return ownDuration;
    } else {
      if (this.compositionType === _constants__WEBPACK_IMPORTED_MODULE_0__["ANIMATION_COMPOSITION_TYPE"].JOIN) {
        return this.subAnimations.reduce((dur, anim) => dur + anim.getDuration() + anim.getOptions().delay, 0);
      }
      if (this.compositionType === _constants__WEBPACK_IMPORTED_MODULE_0__["ANIMATION_COMPOSITION_TYPE"].MIX) {
        return this.subAnimations.reduce((maxDur, anim) => Math.max(maxDur, anim.getDuration() + anim.getOptions().delay), 0);
      }
    }
  }
  getTrigger() {
    return this.descriptor.trigger;
  }
  getDescriptor() {
    if (this._isAtomic) {
      const cleanDescriptor = {
        ...this.descriptor,
        options: Object.fromEntries(Object.entries(this.getOptions()).filter(_ref => {
          let [key, val] = _ref;
          const effectDefault = (this.effect.defaultOptions || {})[key];
          const masterDefault = _constants__WEBPACK_IMPORTED_MODULE_0__["MASTER_DEFAULT_OPTIONS"][key];
          return effectDefault === undefined ? val !== masterDefault : val !== effectDefault;
        }))
      };
      if (!Object.keys(cleanDescriptor.options).length) {
        delete cleanDescriptor.options;
      }
      return cleanDescriptor;
    } else {
      return {
        [this.compositionType]: this.subAnimations.map(sub => sub.getDescriptor())
      };
    }
  }
  writeDescriptorToElement(targetElement) {
    this.manager._writeDescriptorsToElement(targetElement, [this]);
  }
  apply(elementOrSelector) {
    let quiet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["isString"])(elementOrSelector)) {
      return this._getMultiInstanceAPI(Array.from(document.querySelectorAll(elementOrSelector)).reduce((instances, element) => {
        instances.push(this.apply(element));
        return instances;
      }, []));
    } else {
      const existing = this.manager.getInstancesByElement(elementOrSelector).filter(existingInstance => {
        return existingInstance.getAnimation().getTrigger() === this.getTrigger();
      });
      existing.forEach(inst => {
        inst.remove();
        this.manager._removeInstance(inst);
      });
      const instance = new _AnimationInstance__WEBPACK_IMPORTED_MODULE_4__["AnimationInstance"](this, elementOrSelector, this.manager.EngineClass);
      this._registerInstance(instance, quiet);
      return instance;
    }
  }
  createVariation(descriptor) {
    const variation = this.manager.createAnimation({
      ...this.descriptor,
      ...descriptor,
      options: {
        ...this.getOptions()
      }
    });
    variation.setOptions(descriptor.options || {});
    variation.compositionType = this.compositionType;
    variation.subAnimations = [...this.subAnimations];
    return variation;
  }
  setEffect(effect) {
    var _this$manager$_getEff;
    let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["isString"])(effect) || Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["isFunction"])(effect)) {
      this.originalEffect = effect;
    }
    if (Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["isString"])(effect) && this.descriptor) {
      this.descriptor.effect = effect;
    }
    this.effect = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["isString"])(effect) ? this.manager._getEffect(effect, {
      ...(((_this$manager$_getEff = this.manager._getEffect(effect)) === null || _this$manager$_getEff === void 0 ? void 0 : _this$manager$_getEff.defaultOptions) || {}),
      ...this.getOptions()
    }) : effect;
    if (reset) {
      this.resetAllInstances();
    }
    return this;
  }
  getEffect() {
    return this.descriptor.effect && Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["isString"])(this.descriptor.effect) ? this.descriptor.effect : this.originalEffect;
  }
  setTrigger(trigger) {
    this.descriptor.trigger = trigger;
    this._updateTimeline();
    return this;
  }
  setOptions(options) {
    let autoReset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (options.duration === 'auto' && this._isAtomic) {
      options = {
        ...options,
        duration: this.getDuration()
      };
    }
    if (options.duration !== 'auto' && !this._isAtomic) {
      this.autoDuration = false;
    }
    this.descriptor.options = {
      ...this.descriptor.options,
      ...options
    };
    this._updateInstances();
    this._updateTimeline();
    if (autoReset) {
      this.resetAllInstances();
    }
    return this;
  }
  resetAllInstances() {
    this.manager.getInstancesByAnimation(this).forEach(inst => {
      inst.reset();
    });
  }
  contains(animation) {
    return this.subAnimations.includes(animation) || this.subAnimations.some(anim => anim.contains(animation));
  }
  reverse() {
    this.setOptions({
      reverse: !this.getOptions().reverse
    });
    return this;
  }
  setName(name) {
    this.descriptor.name = name;
    this._updateTimeline();
    return this;
  }
  getName() {
    return this.descriptor.name || (this._isAtomic ? this.originalEffect : this.compositionType);
  }
  setDelay(delay) {
    this.setOptions({
      delay
    });
    return this;
  }
  setDuration(duration) {
    this.setOptions({
      duration
    });
    return this;
  }
  join(animations) {
    let replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return this._compose(_constants__WEBPACK_IMPORTED_MODULE_0__["ANIMATION_COMPOSITION_TYPE"].JOIN, animations, replace);
  }
  mix(animations) {
    let replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return this._compose(_constants__WEBPACK_IMPORTED_MODULE_0__["ANIMATION_COMPOSITION_TYPE"].MIX, animations, replace);
  }
  getChild(child) {
    if (Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["isString"])(child)) {
      return this.subAnimations.find(anim => anim.getName() === child);
    } else if (this.subAnimations[child]) {
      return this.subAnimations[child];
    }
  }
  getOption(option) {
    return this.descriptor.options[option] || null;
  }
  getSub(sub) {
    let child = this.getChild(sub);
    if (child) {
      return child;
    }
    child = this.subAnimations.find(anim => anim.getSub(sub));
    if (child) {
      return child.getSub(sub);
    }
  }
  insertChildAfter(childToInsert, insertAfter) {
    const index = this.subAnimations.indexOf(insertAfter);
    if (index !== -1) {
      this.insertChild(childToInsert, index + 1);
      return true;
    }
  }
  insertChild(child, index) {
    if (this._isAtomic) {
      return;
    }
    if (child instanceof Animation) {
      this.subAnimations.splice(index, 0, child);
      this.resetAllInstances();
    } else {
      const anim = this.manager.createAnimation(child);
      if (anim) {
        this.subAnimations.splice(index, 0, anim);
        this.resetAllInstances();
      }
    }
  }
  removeChild(childAnimation) {
    if (this.contains(childAnimation)) {
      if (this.subAnimations.includes(childAnimation)) {
        this.subAnimations.splice(this.subAnimations.indexOf(childAnimation), 1);
      } else {
        this.subAnimations.find(child => child.contains(childAnimation)).removeChild(childAnimation);
      }
      if (this.subAnimations.length === 1) {
        this._replace(this.subAnimations[0]);
      } else {
        this.setDuration(this.getDuration() - childAnimation.getDuration());
      }
      this.resetAllInstances();
      return true;
    } else {
      const child = this.getChild(childAnimation);
      if (child) {
        this.removeChild(child);
      }
    }
  }
  getController() {
    if (this.manager._getExtra('getController', true)) {
      return this.manager._getExtra('getController')(this);
    }
  }
  showComposition() {
    if (this.manager._getExtra('showComposition', true)) {
      this.manager._getExtra('showComposition')(this);
    }
  }
  _updateTimeline() {
    if (this.manager._getExtra('updateTimeline')) {
      this.manager._getExtra('updateTimeline')(this);
    }
  }
  _registerInstance(createdInstance) {
    let quiet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    this.manager._addInstance(createdInstance, quiet);
  }
  _getTimeline() {
    let rawTimeline;
    const options = {
      ...(this.effect.defaultOptions || {}),
      ...this.getOptions()
    };
    if (this.effect.timeline) {
      if (this.effect.timeline instanceof _Timeline__WEBPACK_IMPORTED_MODULE_3__["Timeline"]) {
        rawTimeline = this.effect.timeline.rawTimeline;
      } else {
        rawTimeline = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["getValue"])(this.effect.timeline, options);
      }
    } else if (this.effect.tween) {
      rawTimeline = _Timeline__WEBPACK_IMPORTED_MODULE_3__["Timeline"].fromTween(Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["getValue"])(this.effect.tween, options)).rawTimeline;
    }
    if (!rawTimeline) {
      return null;
    } else {
      const tl = new _Timeline__WEBPACK_IMPORTED_MODULE_3__["Timeline"](rawTimeline);
      if (this.getOptions().arrive) {
        tl.subtractTransform(tl.getLastValues().transform);
      }
      return this.getOptions().reverse ? tl.reverse() : tl;
    }
  }
  _getMultiInstanceAPI(instances) {
    return Object.getOwnPropertyNames(_AnimationInstance__WEBPACK_IMPORTED_MODULE_4__["AnimationInstance"].prototype).reduce((api, method) => {
      if (method !== 'constructor' && !method.startsWith('_') && method !== 'getAnimation') {
        api[method] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return instances.map(inst => {
            return inst[method](...args);
          });
        };
      }
      return api;
    }, {
      getAnimation: () => this
    });
  }
  _replaceDescriptor(descriptor) {
    let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    this.descriptor = descriptor;
    this.setEffect(this.descriptor.effect, reset);
    return this;
  }
  _replace(animation) {
    let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    this._replaceDescriptor(animation.descriptor);
    Animation._copy(animation, this);
    if (reset) {
      this.resetAllInstances();
    }
    return this;
  }
  _recompose() {
    let overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!this._isAtomic) {
      this.subAnimations.forEach(sub => sub._recompose());
      const composition = this.manager._compose(this.compositionType, this.subAnimations, {
        trigger: overrides.trigger || this.getTrigger(),
        name: overrides.name || this.getName(),
        options: {
          ...this.getOptions(),
          ...overrides.options
        }
      });
      this._replace(composition, false);
    } else {
      if (this.copyOf) {
        this._replaceDescriptor({
          ...this.getOriginal().descriptor,
          ...this.descriptor,
          options: {
            ...this.getOriginal().getOptions(),
            ...this.getOptions()
          }
        });
      } else {
        this._resetEffect();
      }
    }
    this._updateTimeline();
    return this;
  }
  _compose(composeType, animations) {
    let replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    animations = Animation._getAnimationsArray(this.manager, Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["getAsArray"])(animations));
    if (this.compositionType === composeType) {
      if (replace) {
        this.subAnimations.push(...animations);
        return this._recompose();
      } else {
        const clone = this.clone();
        clone.subAnimations.push(...animations);
        return clone._recompose();
      }
    }
    const composed = this.manager._compose(composeType, [this.clone(), ...animations]);
    composed.setDuration(this.autoDuration ? 'auto' : this.getDuration());
    if (replace) {
      this._replace(composed);
      return this;
    } else {
      return composed;
    }
  }
  _updateInstances() {
    this.manager.getInstancesByAnimation(this).forEach(inst => {
      inst._update();
    });
  }
  _resetEffect() {
    let reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (this.originalEffect) {
      this.setEffect(this.originalEffect, reset);
    }
  }
  get _isAtomic() {
    return this.compositionType === _constants__WEBPACK_IMPORTED_MODULE_0__["ANIMATION_COMPOSITION_TYPE"].ATOMIC;
  }
  static _getAnimationsArray(manager, array) {
    return array.map(anim => {
      if (!(anim instanceof Animation)) {
        return manager.createAnimation(anim);
      } else {
        return anim;
      }
    });
  }
  static _copy(source, target) {
    target.compositionType = source.compositionType;
    target.subAnimations = [...source.subAnimations];
    target.originalEffect = source.originalEffect;
    target.autoDuration = source.autoDuration;
    target.copyOf = source;
  }
}

//# sourceURL=webpack:///./src/Animation.js?