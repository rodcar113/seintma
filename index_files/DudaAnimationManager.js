__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DudaAnimationManager", function() { return DudaAnimationManager; });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Animation */ "./src/Animation.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _built_in_effects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./built-in-effects */ "./src/built-in-effects.js");
/* harmony import */ var _Dispatcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Dispatcher */ "./src/Dispatcher.js");
/* harmony import */ var _Timeline__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Timeline */ "./src/Timeline.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






class DudaAnimationManager {
  constructor() {
    let libOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _defineProperty(this, "EngineClass", null);
    _defineProperty(this, "effects", {});
    _defineProperty(this, "animationInstances", []);
    _defineProperty(this, "disabled", false);
    this.setEngine(DudaAnimationManager.SceneEngine ? 'scenejs' : 'animejs');
    Object(_built_in_effects__WEBPACK_IMPORTED_MODULE_3__["registerEffects"])(this);
    this.libOptions = libOptions;
    this.dispatcher = new _Dispatcher__WEBPACK_IMPORTED_MODULE_4__["Dispatcher"](this);
    this._scanDomForAnimations();
    this._activate();
  }
  setEngine(engine) {
    const engineClass = DudaAnimationManager[engine === _constants__WEBPACK_IMPORTED_MODULE_2__["Engine"].SCENE ? 'SceneEngine' : engine === _constants__WEBPACK_IMPORTED_MODULE_2__["Engine"].ANIME ? 'AnimeEngine' : null];
    if (engineClass) {
      this.EngineClass = engineClass;
    } else {
      throw new Error('Failed to load engine');
    }
  }
  reset() {
    [...this.animationInstances].forEach(inst => {
      inst.reset();
    });
  }
  defineEffect(name, descriptor) {
    this.effects[name] = descriptor;
  }
  getAllEffectNames() {
    return Object.keys(this.effects);
  }
  getOptionsForEffect(effectName) {
    let showAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const effect = this._getEffect(effectName);
    if (showAll) {
      return effect.defaultOptions || {};
    }
    return Object.fromEntries(Object.entries(effect.defaultOptions || {}).filter(_ref => {
      let [optionName] = _ref;
      return !_constants__WEBPACK_IMPORTED_MODULE_2__["MASTER_DEFAULT_OPTIONS"][optionName];
    }));
  }
  getInstancesByElement(element) {
    return this._filterInstances(inst => {
      return inst.targetElement === element;
    });
  }
  mix(animations) {
    let overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this._compose(_constants__WEBPACK_IMPORTED_MODULE_2__["ANIMATION_COMPOSITION_TYPE"].MIX, animations, overrides);
  }
  join(animations) {
    let overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this._compose(_constants__WEBPACK_IMPORTED_MODULE_2__["ANIMATION_COMPOSITION_TYPE"].JOIN, animations, overrides);
  }
  animate(elementOrSelector) {
    return animationOrDescriptor => {
      if (animationOrDescriptor instanceof _Animation__WEBPACK_IMPORTED_MODULE_1__["Animation"]) {
        return animationOrDescriptor.apply(elementOrSelector);
      } else {
        return this.createAnimation(animationOrDescriptor).apply(elementOrSelector);
      }
    };
  }
  createAnimation(structure) {
    const recursiveCompose = root => {
      const method = obj => obj[_constants__WEBPACK_IMPORTED_MODULE_2__["ANIMATION_COMPOSITION_TYPE"].JOIN] ? _constants__WEBPACK_IMPORTED_MODULE_2__["ANIMATION_COMPOSITION_TYPE"].JOIN : obj[_constants__WEBPACK_IMPORTED_MODULE_2__["ANIMATION_COMPOSITION_TYPE"].MIX] ? _constants__WEBPACK_IMPORTED_MODULE_2__["ANIMATION_COMPOSITION_TYPE"].MIX : null;
      if (method(root)) {
        return this[method(root)](root[method(root)].map(entry => {
          if (entry instanceof _Animation__WEBPACK_IMPORTED_MODULE_1__["Animation"]) {
            return entry;
          } else if (method(entry)) {
            return recursiveCompose(entry);
          } else {
            return new _Animation__WEBPACK_IMPORTED_MODULE_1__["Animation"](this, entry);
          }
        }));
      } else if (root.effect) {
        return new _Animation__WEBPACK_IMPORTED_MODULE_1__["Animation"](this, root);
      } else {
        throw new Error('Illegal composition structure');
      }
    };
    return recursiveCompose(structure);
  }
  composeTimelines(compositionObject) {
    let compositionType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _constants__WEBPACK_IMPORTED_MODULE_2__["ANIMATION_COMPOSITION_TYPE"].MIX;
    const animations = Object.entries(compositionObject).map(_ref2 => {
      let [effect, options] = _ref2;
      return this.createAnimation({
        effect,
        options
      });
    });
    return this.createAnimation({
      [compositionType]: animations
    })._getTimeline().rawTimeline;
  }
  cleanDOM() {
    this.animationInstances.forEach(inst => inst.cleanElement());
  }
  disable() {
    this.disabled = true;
    this.cleanDOM();
  }
  enable() {
    this.disabled = false;
    this.animationInstances.filter(inst => inst.getAnimation().getTrigger() !== _constants__WEBPACK_IMPORTED_MODULE_2__["Trigger"].ENTRANCE).forEach(inst => inst.reset());
  }
  removeAll() {
    [...this.animationInstances].forEach(inst => inst.remove());
  }
  destroy() {
    this.removeAll();
    this.dispatcher.removeListeners();
  }
  getInstancesByAnimation(animation) {
    return this._filterInstances(inst => {
      return inst.getAnimation() === animation || inst.getAnimation().contains(animation) || inst.getAnimation().copyOf === animation;
    });
  }
  getInstancesByTrigger(trigger) {
    return this._filterInstances(inst => {
      return inst.getAnimation().getTrigger() === trigger;
    });
  }
  getInstancesByEffect(effect) {
    return this._filterInstances(inst => {
      return inst.getAnimation().descriptor.effect === effect;
    });
  }
  _writeDescriptorsToElement(targetElement) {
    let add = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    const allDescriptors = this.getInstancesByElement(targetElement).map(instance => instance.getAnimation()).filter(anim => !add.includes(anim)).concat(add).map(anim => anim.getDescriptor());
    targetElement.setAttribute(_constants__WEBPACK_IMPORTED_MODULE_2__["ANIM_DATA_ATTR"], btoa(JSON.stringify(allDescriptors)));
  }
  _filterInstances(filter) {
    return this.animationInstances.filter(filter);
  }
  _addInstance(instance) {
    let quiet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!this.animationInstances.includes(instance)) {
      this.animationInstances.push(instance);
      if (!quiet) {
        this._activate();
      }
      this.dispatcher.addScrollListener(instance.targetElement);
    }
  }
  _compose(type, animations) {
    var _overrides$options, _overrides$options2;
    let overrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    animations = _Animation__WEBPACK_IMPORTED_MODULE_1__["Animation"]._getAnimationsArray(this, Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getAsArray"])(animations));
    const trigger = overrides.trigger || animations[0].getTrigger();
    const timelines = animations.map(anim => {
      const normalTimeline = anim._getTimeline().normalize();
      return normalTimeline.transform({
        duration: anim.getDuration(),
        delay: anim.getOptions().delay
      });
    });
    const composedTimeline = _Timeline__WEBPACK_IMPORTED_MODULE_5__["Timeline"][type](timelines);
    const arrive = ((_overrides$options = overrides.options) === null || _overrides$options === void 0 ? void 0 : _overrides$options.arrive) || animations[0].getOptions().arrive;
    if (arrive) {
      composedTimeline.subtractTransform(composedTimeline.getLastValues().transform);
    }
    const composedAnimation = this.createAnimation({
      trigger,
      name: overrides.name,
      effect: {
        timeline: composedTimeline.removeOffset()
      },
      options: {
        duration: composedTimeline.getDuration(),
        delay: composedTimeline.getOffset(),
        viewportThresholds: animations[0].getOptions().viewportThresholds,
        ...overrides.options
      }
    });
    composedAnimation.compositionType = type;
    composedAnimation.subAnimations = [...animations];
    composedAnimation.setDuration(((_overrides$options2 = overrides.options) === null || _overrides$options2 === void 0 ? void 0 : _overrides$options2.duration) || 'auto');
    return composedAnimation;
  }
  _getExtra(extra) {
    let displayError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const extrasRoot = window[Symbol.for('DAM.EXTRAS')];
    const resolved = extrasRoot && extrasRoot[extra] ? extrasRoot[extra] : null;
    if (!resolved && displayError) {
      console.error('extras module is needed for ', extra);
    }
    return resolved;
  }
  _activate() {
    this.dispatcher._activateEntranceAnimationsInViewport();
    this._activateAlwaysRunningAnimations();
    this._initViewportAnimations();
    this._initHoverAnimations();
  }
  _syncInstance(inst) {
    if (inst.getAnimation().getTrigger() === _constants__WEBPACK_IMPORTED_MODULE_2__["Trigger"].ENTRANCE) {
      this.dispatcher._activateEntranceAnimationsInViewport([inst]);
    } else if (inst.getAnimation().getTrigger() === _constants__WEBPACK_IMPORTED_MODULE_2__["Driver"].VIEWPORT) {
      inst._seekToViewportPosition();
    }
  }
  _removeInstance(instance) {
    let replacer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const index = this.animationInstances.indexOf(instance);
    if (index >= 0) {
      const args = [index, 1];
      if (replacer) {
        args.push(replacer);
      }
      this.animationInstances.splice(...args);
      this.dispatcher.removeScrollListener(instance.targetElement);
      if (replacer) {
        this.dispatcher.addScrollListener(replacer.targetElement);
      }
    }
  }
  _replaceInstance(instance, replacer) {
    this._removeInstance(instance, replacer);
  }
  _getHoverInstancesForElement(elem) {
    return this.getInstancesByTrigger(_constants__WEBPACK_IMPORTED_MODULE_2__["Trigger"].HOVER).filter(inst => {
      return inst.targetElement === elem;
    });
  }
  _initHoverAnimations() {
    const hoverInstances = this.getInstancesByTrigger(_constants__WEBPACK_IMPORTED_MODULE_2__["Trigger"].HOVER);
    hoverInstances.forEach(inst => inst.seek(0));
  }
  _initViewportAnimations() {
    if (this.disabled) {
      return;
    }
    const viewportInstances = this.getInstancesByTrigger(_constants__WEBPACK_IMPORTED_MODULE_2__["Driver"].VIEWPORT);
    viewportInstances.forEach(inst => inst._seekToViewportPosition());
  }
  _activateAlwaysRunningAnimations() {
    const alwaysActivatedAnimatedElements = this.getInstancesByTrigger(_constants__WEBPACK_IMPORTED_MODULE_2__["Trigger"].ALWAYS);
    this._runAnimations(alwaysActivatedAnimatedElements);
  }
  _scanDomForAnimations() {
    const animatedElements = document.querySelectorAll("[".concat(_constants__WEBPACK_IMPORTED_MODULE_2__["ANIM_DATA_ATTR"], "]"));
    animatedElements.forEach(elem => {
      const descriptors = JSON.parse(atob(elem.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_2__["ANIM_DATA_ATTR"])));
      descriptors.forEach(descriptor => {
        let animation;
        animation = this.createAnimation(descriptor);
        this._addInstance(animation.apply(elem));
      });
    });
  }
  _runAnimations(instances) {
    instances.forEach(inst => {
      inst.play();
    });
  }
  _stopAnimations(instances) {
    instances.forEach(inst => {
      inst.pauseOnIterationEnd();
    });
  }
  _getEffect(effect) {
    let effectOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["isString"])(effect)) {
      const found = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getValue"])(this.effects[effect], effectOptions);
      if (!found) {
        throw new Error('Unknown effect: ' + effect);
      }
      return found;
    }
    return effect;
  }
}
_defineProperty(DudaAnimationManager, "SceneEngine", null);
_defineProperty(DudaAnimationManager, "AnimeEngine", null);

//# sourceURL=webpack:///./src/DudaAnimationManager.js?