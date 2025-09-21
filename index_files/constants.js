__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Engine", function() { return Engine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Trigger", function() { return Trigger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Driver", function() { return Driver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ANIMATION_COMPOSITION_TYPE", function() { return ANIMATION_COMPOSITION_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ANIM_DATA_ATTR", function() { return ANIM_DATA_ATTR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MASTER_DEFAULT_OPTIONS", function() { return MASTER_DEFAULT_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUPPORTED_TRANSFORM_PROPERTIES", function() { return SUPPORTED_TRANSFORM_PROPERTIES; });
const Engine = {
  SCENE: 'scenejs',
  ANIME: 'animejs'
};
const Trigger = {
  ENTRANCE: 'entrance',
  ALWAYS: 'always',
  HOVER: 'hover'
};
const Driver = {
  MOUSE_PROXIMITY: 'mouse-proximity',
  VIEWPORT: 'viewport'
};
const ANIMATION_COMPOSITION_TYPE = {
  ATOMIC: 'atomic',
  MIX: 'mix',
  JOIN: 'join'
};
const ANIM_DATA_ATTR = 'data-anim-descriptor';
const MASTER_DEFAULT_OPTIONS = {
  intensity: 1,
  duration: 1,
  delay: 0,
  yoyo: false,
  loop: false,
  reverse: false,
  arrive: false,
  easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
  relative: false,
  proximityThreshold: 1000,
  viewportThresholds: {
    top: 0,
    bottom: 0
  }
};
const SUPPORTED_TRANSFORM_PROPERTIES = ['translate', 'translate3d', 'translateX', 'translateY', 'translateZ', 'scale', 'scale3d', 'scaleX', 'scaleY', 'scaleZ', 'rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY'];

//# sourceURL=webpack:///./src/constants.js?