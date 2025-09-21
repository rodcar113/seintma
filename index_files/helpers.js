__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isElementInViewport", function() { return isElementInViewport; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getScrollParent", function() { return getScrollParent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDocumentScrollingElement", function() { return getDocumentScrollingElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getElementOriginalBoundingRect", function() { return getElementOriginalBoundingRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUniqueName", function() { return getUniqueName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAsArray", function() { return getAsArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFunction", function() { return isFunction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return isObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getValue", function() { return getValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isUndefined", function() { return isUndefined; });
function isElementInViewport(element) {
  let proximity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let ignoreSides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  try {
    const win = element.ownerDocument.defaultView;
    const rect = getElementOriginalBoundingRect(element);
    const isInViewportHorizontally = -rect.width < rect.left + proximity && rect.left - proximity <= win.innerWidth;
    const isInViewportVertically = -rect.height < rect.top + proximity && rect.top - proximity <= win.innerHeight;
    return (ignoreSides || isInViewportHorizontally) && isInViewportVertically;
  } catch (err) {
    return false;
  }
}
function getScrollParent(element) {
  let includeHidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
  if (style.position === 'fixed') return getDocumentScrollingElement();
  for (let parent = element; parent = parent.parentElement;) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      let scrollable = true;
      if (parent.scrollTop === 0) {
        parent.scrollTop = 1;
        if (parent.scrollTop === 0) {
          scrollable = false;
        } else {
          parent.scrollTop = 0;
        }
      }
      if (scrollable) {
        return parent === document.body ? getDocumentScrollingElement() : parent;
      }
    }
  }
  return getDocumentScrollingElement();
}
function getDocumentScrollingElement() {
  return document.scrollingElement || document.documentElement || document.body;
}
function getElementOriginalBoundingRect(elem) {
  if (!isUndefined(elem.originalElementStyle)) {
    const tempStyle = elem.getAttribute('style');
    elem.setAttribute('style', elem.originalElementStyle);
    const rect = elem.getBoundingClientRect();
    if (tempStyle === 'null') {
      elem.removeAttribute('style');
    } else {
      elem.setAttribute('style', tempStyle);
    }
    return rect;
  }
  return elem.getBoundingClientRect();
}
function getUniqueName(name, isUnique) {
  if (!isUnique(name)) {
    let _name = name + '-2';
    for (let i = 3; !isUnique(_name); i++) {
      _name = name + "-".concat(i);
    }
    return _name;
  }
  return name;
}
function getAsArray(item) {
  return Array.isArray(item) ? item : [item];
}
const getType = value => Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1];
const isFunction = value => getType(value) === 'Function';
const isString = value => getType(value) === 'String';
function isObject(value) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}
const getValue = (valOrFunc, arg) => {
  return isFunction(valOrFunc) ? getValue(valOrFunc(arg), arg) : valOrFunc;
};
const isUndefined = val => val === undefined;

//# sourceURL=webpack:///./src/helpers.js?