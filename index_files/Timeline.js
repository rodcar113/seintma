__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Timeline", function() { return Timeline; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var lodash_intersection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash.intersection */ "../../node_modules/lodash.intersection/index.js");
/* harmony import */ var lodash_intersection__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_intersection__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StyleManipulator */ "./src/StyleManipulator.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");




class Timeline {
  constructor(rawTimeline) {
    this.rawTimeline = rawTimeline;
  }
  getPropertiesAt(timeKey) {
    var _this$getEntries$find;
    return (_this$getEntries$find = this.getEntries().find(_ref => {
      let [entryTimeKey] = _ref;
      return entryTimeKey === timeKey;
    })) === null || _this$getEntries$find === void 0 ? void 0 : _this$getEntries$find[1];
  }
  getPropertyAt(timeKey, propName) {
    var _this$getPropertiesAt;
    return (_this$getPropertiesAt = this.getPropertiesAt(timeKey)) === null || _this$getPropertiesAt === void 0 ? void 0 : _this$getPropertiesAt[propName];
  }
  getStyleManipulatorAt(timeKey) {
    return _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].fromObject(this.getPropertiesAt(timeKey));
  }
  getPropertyNamesAt(timeKey) {
    return this.getStyleManipulatorAt(timeKey).getProperties();
  }
  getTransformPropertyNamesAt(timeKey) {
    return this.getStyleManipulatorAt(timeKey).getTransformProperties();
  }
  getAllPropertyNames() {
    let transform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const method = transform ? 'getTransformPropertyNamesAt' : 'getPropertyNamesAt';
    return this.getTimeKeys().map(timeKey => this[method](timeKey)).reduce((allProps, current) => {
      current.forEach(prop => {
        if (!allProps.includes(prop)) {
          allProps.push(prop);
        }
      });
      return allProps;
    }, []);
  }
  getAllTransformPropertyNames() {
    return this.getAllPropertyNames(true);
  }
  getFirstValues() {
    return this._getFirstOrLastValue(true);
  }
  getLastValues() {
    return this._getFirstOrLastValue(false);
  }
  _getFirstOrLastValue() {
    let first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    return this.getTimeKeys().reduce((values, timeKey) => {
      this.getPropertyNamesAt(timeKey).forEach(propName => {
        if ((Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["isUndefined"])(values[propName]) || !first) && propName !== 'transform') {
          values[propName] = this.getPropertyAt(timeKey, propName);
        }
      });
      const transform = this.getPropertyAt(timeKey, 'transform');
      const trans1 = first ? {
        transform
      } : {
        transform: values.transform || ''
      };
      const trans2 = !first ? {
        transform
      } : {
        transform: values.transform || ''
      };
      if (transform) {
        values.transform = _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].fromObject(trans1).extend(_StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].fromObject(trans2)).toObject(false).transform;
      }
      return values;
    }, {});
  }
  static fromTween(tween) {
    return new Timeline({
      0: tween.start,
      100: tween.end
    });
  }
  normalize() {
    const offset = this.getOffset();
    const duration = this.getDuration();
    const durationRatio = 100 / duration;
    this.rawTimeline = this.getEntries().reduce((newTimeline, _ref2) => {
      let [timeKey, propsObject] = _ref2;
      const newKey = String(((parseFloat(timeKey) - offset) * durationRatio).toFixed(2));
      newTimeline[newKey] = propsObject;
      return newTimeline;
    }, {});
    return this;
  }
  getTimeKeys() {
    return Object.keys(this.rawTimeline).map(key => parseFloat(key)).sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  }
  getEntries() {
    return Object.entries(this.rawTimeline).map(_ref3 => {
      let [key, val] = _ref3;
      return [parseFloat(key), val];
    }).sort((_ref4, _ref5) => {
      let [key1] = _ref4;
      let [key2] = _ref5;
      return key1 < key2 ? -1 : key1 > key2 ? 1 : 0;
    });
  }
  getDuration() {
    const timeKeys = this.getTimeKeys();
    return timeKeys.slice(-1)[0] - timeKeys[0];
  }
  getTotalDuration() {
    return this.getTimeKeys().slice(-1)[0];
  }
  getOffset() {
    return this.getTimeKeys()[0];
  }
  transform(_ref6) {
    let {
      duration = null,
      delay = 0
    } = _ref6;
    if (duration) {
      this.changeDuration(duration);
    }
    this.addOffset(delay);
    return this;
  }
  changeDuration(duration) {
    const offset = this.getOffset();
    const oldDuration = this.getDuration();
    const durationRatio = duration / oldDuration;
    this.rawTimeline = this.getEntries().reduce((newTimeline, _ref7) => {
      let [timeKey, propsObject] = _ref7;
      const newKey = String(((parseFloat(timeKey) - offset) * durationRatio + offset).toFixed(2));
      newTimeline[newKey] = propsObject;
      return newTimeline;
    }, {});
    return this;
  }
  addOffset(delay) {
    this.rawTimeline = this.getEntries().reduce((newTimeline, _ref8) => {
      let [timeKey, propsObject] = _ref8;
      const newKey = (parseFloat(timeKey) + delay).toFixed(2);
      newTimeline[newKey] = propsObject;
      return newTimeline;
    }, {});
    return this;
  }
  removeOffset() {
    const offset = this.getOffset();
    this.rawTimeline = this.getEntries().reduce((newTimeline, _ref9) => {
      let [timeKey, propsObject] = _ref9;
      const newKey = String((parseFloat(timeKey) - offset).toFixed(2));
      newTimeline[newKey] = propsObject;
      return newTimeline;
    }, {});
    return this;
  }
  reverse() {
    const offset = this.getOffset();
    const duration = this.getDuration();
    this.rawTimeline = this.getEntries().reverse().reduce((newTimeline, _ref10) => {
      let [timeKey, propsObject] = _ref10;
      const newKey = String((duration - (parseFloat(timeKey) - offset)).toFixed(2));
      newTimeline[newKey] = propsObject;
      return newTimeline;
    }, {});
    return this;
  }
  addTransform(transformString) {
    if (!transformString) {
      return this;
    }
    this.rawTimeline = this.getEntries().reduce((transformed, _ref11) => {
      let [timeKey, propsObject] = _ref11;
      const style = _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].fromObject(propsObject);
      style.addTransform(transformString);
      transformed[timeKey.toFixed(2)] = style.toObject(false);
      return transformed;
    }, {});
    return this;
  }
  subtractTransform(transformString) {
    return this.addTransform(_StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].getNegativeTransform(transformString));
  }
  static join(timelines) {
    let joinTime = 0;
    let firstKey = timelines[0].getTimeKeys()[0];
    let lastTimeline = null;
    return new Timeline(timelines.reduce((joined, timeline) => {
      const startStyle = timelines[0].getStyleManipulatorAt(firstKey);
      const firstInTimeline = _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].fromObject(timeline.getFirstValues());
      joined[firstKey.toFixed(2)] = startStyle.extend(firstInTimeline, false).toObject(false);
      if (lastTimeline) {
        const lastValues = _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].fromObject(lastTimeline.getLastValues()).toObject();
        const sm = _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].fromObject(lastValues);
        timeline.addTransform(sm.getTransformString());
      }
      timeline.getEntries().forEach(_ref12 => {
        let [timeKey, propsObject] = _ref12;
        const newKey = String((joinTime + parseFloat(timeKey)).toFixed(2));
        if (joined[newKey]) {
          const prevStyle = _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].fromObject(joined[newKey]);
          const newStyle = _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].fromObject(propsObject);
          joined[newKey] = prevStyle.extend(newStyle).toObject(false);
        } else {
          joined[newKey] = propsObject;
        }
      });
      joinTime += timeline.getTimeKeys().slice(-1)[0];
      lastTimeline = timeline;
      return joined;
    }, {}));
  }
  static mix(timelines) {
    const composition = {};
    timelines.forEach(timeline => {
      if (timeline.getOffset()) {
        timeline.rawTimeline['0.00'] = timeline.getFirstValues();
      }
      timeline.getEntries().forEach(_ref13 => {
        let [timeKey, propsObject] = _ref13;
        if (!composition[timeKey]) {
          composition[timeKey] = propsObject;
        } else {
          const merge = {
            ...composition[timeKey]
          };
          Object.entries(propsObject).forEach(_ref14 => {
            let [property, value] = _ref14;
            if (!merge[property]) {
              merge[property] = value;
            } else {
              if (property === 'transform') {
                const existingTransformProps = _constants__WEBPACK_IMPORTED_MODULE_0__["SUPPORTED_TRANSFORM_PROPERTIES"].filter(tProp => {
                  return merge.transform.includes(tProp);
                });
                const newTransformProps = _constants__WEBPACK_IMPORTED_MODULE_0__["SUPPORTED_TRANSFORM_PROPERTIES"].filter(tProp => {
                  return value.includes(tProp);
                });
                const intersects = lodash_intersection__WEBPACK_IMPORTED_MODULE_1___default()(existingTransformProps, newTransformProps);
                if (intersects.length) {
                  console.error('Conflict in transform property animation:', ...intersects);
                } else {
                  merge.transform += ' ' + value;
                  merge.transform = _StyleManipulator__WEBPACK_IMPORTED_MODULE_2__["StyleManipulator"].sortTransform(merge.transform);
                }
              } else {
                console.error('Conflict in property animation:', property);
                merge[property] = value;
              }
            }
          });
          composition[timeKey] = merge;
          /*
              composition[timeKey] = StyleManipulator
                  .fromObject(composition[timeKey])
                  .extend(StyleManipulator.fromObject(propsObject))
                  .toObject(false);
          */
        }
      });
    });
    return new Timeline(composition);
  }
}

//# sourceURL=webpack:///./src/Timeline.js?