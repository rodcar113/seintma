__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Engine", function() { return Engine; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");

class Engine {
  constructor(instance) {
    this.instance = instance;
  }
  play() {}
  pause() {}
  seek( /*time*/
  ) {}
  getTime() {}
  isPlaying() {}
  kill() {}
  _shouldLoop() {
    return [_constants__WEBPACK_IMPORTED_MODULE_0__["Trigger"].ALWAYS, _constants__WEBPACK_IMPORTED_MODULE_0__["Trigger"].HOVER].includes(this.getAnimation().getTrigger()) || this.getAnimation().getOptions().loop;
  }
  cleanElement() {}
  getAnimation() {
    return this.instance.getAnimation();
  }
  getTargetElement() {
    return this.instance.targetElement;
  }
  update() {}
}

//# sourceURL=webpack:///./src/Engine.js?