__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StyleManipulator", function() { return StyleManipulator; });
/* harmony import */ var lodash_trim__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash.trim */ "lodash.trim");
/* harmony import */ var lodash_trim__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_trim__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


class StyleManipulator {
  constructor() {
    let styleStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let clean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    _defineProperty(this, "strState", null);
    if (!StyleManipulator.sharedElement) {
      StyleManipulator.sharedElement = document.createElement('div');
    }
    this.elem.setAttribute('style', styleStr);
    if (clean) {
      this._cleanStyle();
    }
  }
  get elem() {
    if (StyleManipulator.current !== this) {
      if (StyleManipulator.current) {
        StyleManipulator.current.strState = StyleManipulator.sharedElement.getAttribute('style');
      }
      StyleManipulator.sharedElement.setAttribute('style', this.strState);
      StyleManipulator.current = this;
    }
    return StyleManipulator.sharedElement;
  }
  static fromObject(obj) {
    let clean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    const mapper = (o, builder, sep) => Object.entries(o).map(_ref => {
      let [key, val] = _ref;
      if (key === 'transform' && Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["isObject"])(val)) {
        return "".concat(key, ": ").concat(mapper(val, (key, val) => "".concat(key, "(").concat(val, ")"), ' '));
      }
      return builder(key, val);
    }).join(sep);
    return new StyleManipulator(mapper(obj, (key, val) => "".concat(key, ": ").concat(val), '; '), clean);
  }
  toString() {
    return this.elem.getAttribute('style');
  }
  toObject() {
    let objectifyTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    const style = this.elem.style;
    const obj = {};
    for (let i = 0; i < style.length; i++) {
      obj[style[i]] = style[style[i]];
    }
    return Object.entries(obj).reduce((convertedProps, _ref2) => {
      let [key, val] = _ref2;
      if (key === 'transform' && objectifyTransform) {
        convertedProps.transform = StyleManipulator._objectifyTransformString(val);
      } else {
        convertedProps[key] = val;
      }
      return convertedProps;
    }, {});
  }
  static _objectifyTransformString(transformString) {
    const object = {};
    const commands = transformString.split(') ');
    commands.forEach(command => {
      if (command.trim()) {
        const [cmd, params] = command.split('(').map(v => lodash_trim__WEBPACK_IMPORTED_MODULE_0___default()(v, '() '));
        object[cmd] = params;
      }
    });
    return object;
  }
  getProperties() {
    return Object.keys(this.toObject(false));
  }
  hasProperty(prop) {
    return this.getProperties().includes(prop);
  }
  getTransformProperties() {
    var _this$toObject;
    return Object.keys(((_this$toObject = this.toObject()) === null || _this$toObject === void 0 ? void 0 : _this$toObject.transform) || {});
  }
  getTransformString() {
    return this.toObject(false).transform || '';
  }
  extend(otherStyle) {
    let overwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    otherStyle = otherStyle instanceof StyleManipulator ? otherStyle : new StyleManipulator(otherStyle);
    const otherObject = otherStyle.toObject();
    Object.entries(otherObject).forEach(_ref3 => {
      let [attr, value] = _ref3;
      if (attr === 'transform') {
        const mergedTransformObject = this._mergeTransform(otherObject.transform, overwrite);
        this.elem.style.transform = Object.entries(mergedTransformObject).sort(StyleManipulator.transformSorter).map(_ref4 => {
          let [transAttr, transVal] = _ref4;
          return "".concat(transAttr, "(").concat(transVal, ")");
        }).join(' ');
      } else {
        if (overwrite && this.elem.style[attr] !== undefined) {
          this.elem.style[attr] = value;
        }
      }
    });
    return this;
  }
  addTransform(transform) {
    if (!transform) {
      return this;
    }
    if (Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["isString"])(transform)) {
      transform = new StyleManipulator("transform: ".concat(transform)).toObject().transform;
    }
    const newTransform = Object.entries(transform).sort(StyleManipulator.transformSorter).reduce((transformedTransform, _ref5) => {
      let [prop, val] = _ref5;
      if (!transformedTransform[prop]) {
        transformedTransform[prop] = val;
      } else {
        const valuesData = StyleManipulator._extractTransformParams(val);
        const currentValuesData = StyleManipulator._extractTransformParams(transformedTransform[prop]);
        transformedTransform[prop] = valuesData.map((valData, index) => {
          if (valData.unit === currentValuesData[index].unit || !currentValuesData[index].unit || !valData.unit) {
            let newVal;
            if (prop === 'rotate3d' && index < 3) {
              if (currentValuesData[index].number !== valData.number) {
                console.error('trying to add rotation on different axis');
              } else {
                newVal = currentValuesData[index].number;
              }
            } else {
              newVal = prop.startsWith('scale') ? currentValuesData[index].number * valData.number : currentValuesData[index].number + valData.number;
            }
            return "".concat(newVal).concat(valData.unit || currentValuesData[index].unit);
          } else {
            throw 'unit mismatch: ' + currentValuesData[index].unit + ' | ' + valData.unit;
          }
        }).join(', ');
      }
      return transformedTransform;
    }, this.toObject().transform || {});
    this.elem.style.transform = '';
    this.extend(StyleManipulator.fromObject({
      transform: newTransform
    }));
    return this;
  }
  static _transformObjectToString(transObject) {
    return Object.entries(transObject).sort(StyleManipulator.transformSorter).map(_ref6 => {
      let [f, p] = _ref6;
      return "".concat(f, "(").concat(p, ")");
    }).join(' ');
  }
  static sortTransform(transString) {
    return StyleManipulator._transformObjectToString(new StyleManipulator("transform: ".concat(transString)).toObject().transform);
  }
  static getNegativeTransform(transformString) {
    if (!transformString) {
      return transformString;
    }
    const transObj = this._objectifyTransformString(transformString);
    return Object.entries(transObj).map(_ref7 => {
      let [transProp, val] = _ref7;
      const params = this._extractTransformParams(val);
      const newValue = params.map((param, index) => {
        if (transProp.startsWith('scale')) {
          return String(1 / param.number);
        }
        if (transProp === 'rotate3d' && index !== 3) {
          return "".concat(param.number).concat(param.unit);
        } else {
          return "".concat(-param.number).concat(param.unit);
        }
      }).join(', ');
      return "".concat(transProp, "(").concat(newValue, ")");
    }).join(' ');
  }
  static _extractTransformParams(val) {
    const unitsRegex = /[^0-9-.]/;
    return val.split(',').map(v => v.trim()).map(v => ({
      raw: v,
      number: parseFloat(v),
      unit: v.match(unitsRegex) ? v.substr(v.match(unitsRegex).index) : ''
    }));
  }
  static transformSorter(_ref8, _ref9) {
    let [transAttr1] = _ref8;
    let [transAttr2] = _ref9;
    const check = type => {
      if (transAttr1.startsWith(type) && !transAttr2.startsWith(type)) {
        return -1;
      } else if (!transAttr1.startsWith(type) && transAttr2.startsWith(type)) {
        return 1;
      } else {
        return 0;
      }
    };
    return check('translate') || check('scale') || 0;
  }
  _mergeTransform(transObject) {
    let overwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    return Object.entries(transObject).reduce((merge, _ref10) => {
      let [attr, val] = _ref10;
      const TSR = ['translate', 'scale', 'rotate'];
      if (TSR.some(p => [p + 'X', p + 'Y', p + 'Z'].includes(attr))) {
        const type = attr.slice(0, -1);
        if (!merge[type] || overwrite) {
          merge[attr] = val;
        }
      } else if (TSR.includes(attr)) {
        const mergeKeys = Object.keys(merge);
        if (!TSR.some(p => mergeKeys.some(mk => mk.startsWith(p))) || overwrite) {
          merge[attr] = val;
        }
      } else if (merge[attr] === undefined || overwrite) {
        merge[attr] = val;
      }
      return merge;
    }, {
      ...this.toObject().transform
    });
  }
  _cleanStyle() {
    const object = this.toObject();
    if (!object.transform) {
      return;
    }
    const current = {
      translate: {},
      scale: {},
      rotate: {}
    };
    const XYZ = ['X', 'Y', 'Z'];
    Object.entries(object.transform).forEach(_ref11 => {
      let [transProp, value] = _ref11;
      const type = Object.keys(current).find(p => transProp.startsWith(p));
      if (type) {
        if (type === transProp || transProp === type + '3d' && type !== 'rotate') {
          const params = StyleManipulator._extractTransformParams(value);
          params.forEach((p, i) => {
            const oldVal = current[type][XYZ[i].toLowerCase()];
            if (oldVal) {
              if (oldVal.unit === p.unit || !p.unit && !p.number || !oldVal.unit && !oldVal.number) {
                if (type === 'scale') {
                  current[type][XYZ[i].toLowerCase()].number *= p.number;
                } else {
                  current[type][XYZ[i].toLowerCase()].number += p.number;
                }
              } else {
                console.error('Transform conflict!', transProp);
              }
            } else {
              current[type][XYZ[i].toLowerCase()] = p;
            }
          });
        } else if (transProp === 'rotate3d') {
          current.rotate['3d'] = value;
        } else {
          XYZ.forEach(axis => {
            if (transProp === type + axis) {
              const oldVal = current[type][axis.toLowerCase()];
              const newVal = StyleManipulator._extractTransformParams(value)[0];
              if (oldVal) {
                if (oldVal.unit === newVal.unit || !oldVal.unit && !oldVal.number || !newVal.unit && !newVal.number) {
                  if (type === 'scale') {
                    current[type][axis.toLowerCase()].number *= newVal.number;
                  } else {
                    current[type][axis.toLowerCase()].number += newVal.number;
                  }
                } else {
                  console.error('Transform conflict!', transProp);
                }
              } else {
                current[type][axis.toLowerCase()] = newVal;
              }
            }
          });
        }
      }
    });
    Object.keys(current).forEach(type => {
      if (Object.keys(current[type]).length) {
        object.transform = Object.fromEntries(Object.entries(object.transform).filter(_ref12 => {
          let [key] = _ref12;
          return !key.startsWith(type);
        }));
        const n = Object.keys(current[type]).length;
        if (n > 1 || type === 'rotate' && !current[type]['3d']) {
          object.transform[type + (n === 3 ? '3d' : '')] = XYZ.map(axis => {
            const val = current[type][axis.toLowerCase()];
            if (val) {
              return String(val.number + val.unit);
            }
          }).filter(v => !!v).join(', ');
        } else {
          XYZ.forEach(axis => {
            const val = current[type][axis.toLowerCase()];
            if (val) {
              object.transform[type + axis] = val.number + val.unit;
            }
          });
        }
      }
      if (current.rotate['3d']) {
        object.transform.rotate3d = current.rotate['3d'];
      }
    });
    this.elem.style.transform = StyleManipulator._transformObjectToString(object.transform);
  }
}
_defineProperty(StyleManipulator, "sharedElement", null);
_defineProperty(StyleManipulator, "current", null);

//# sourceURL=webpack:///./src/StyleManipulator.js?