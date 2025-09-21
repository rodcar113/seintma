__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerEffects", function() { return registerEffects; });
function registerEffects(dam) {
  // core reusable effects

  // move

  dam.defineEffect('translate-2d', {
    defaultOptions: {
      startX: 0,
      startY: 0,
      endX: 100,
      endY: 100,
      use3d: false,
      unit: 'px'
    },
    tween: options => {
      const prop = options.use3d ? 'translate3d' : 'translate';
      const unit = options.unit;
      return {
        start: {
          transform: "".concat(prop, "(").concat(options.startX).concat(unit, ",").concat(options.startY).concat(unit).concat(options.use3d ? ',0' : '', ")")
        },
        end: {
          transform: "".concat(prop, "(").concat(options.endX).concat(unit, ",").concat(options.endY).concat(unit).concat(options.use3d ? ',0' : '', ")")
        }
      };
    }
  });
  dam.defineEffect('move', {
    defaultOptions: {
      to: 'right'
    },
    timeline: options => {
      const amount = 1000 * options.intensity;
      const isDir = dir => options.to === dir;
      return dam.composeTimelines({
        'translate-2d': {
          startX: 0,
          startY: 0,
          endX: (isDir('right') ? 1 : isDir('left') ? -1 : 0) * amount,
          endY: (isDir('down') ? 1 : isDir('up') ? -1 : 0) * amount
        }
      });
    }
  });
  dam.defineEffect('slide-in', {
    defaultOptions: {
      from: 'left'
    },
    timeline: options => {
      return dam.composeTimelines({
        'move': {
          intensity: options.intensity,
          to: options.from,
          reverse: true
        }
      });
    }
  });
  dam.defineEffect('slide-out', {
    timeline: options => dam.composeTimelines({
      'slide-in': {
        ...options,
        reverse: true
      }
    })
  });

  // rotate

  dam.defineEffect('rotate-2d', {
    defaultOptions: {
      to: 'right',
      start: 0,
      end: 90,
      use3d: false
    },
    tween: options => {
      const end = options.to === 'right' ? options.end : -options.end;
      const get = val => options.use3d ? "rotate3d(0,0,1,".concat(val).concat(val === 0 ? '' : 'deg', ")") : "rotate(".concat(val).concat(val === 0 ? '' : 'deg', ")");
      return {
        start: {
          'transform': get(options.start)
        },
        end: {
          'transform': get(end)
        }
      };
    }
  });
  dam.defineEffect('rotate', dam._getEffect('rotate-2d'));
  dam.defineEffect('rotate-in', {
    defaultOptions: {
      from: 'left'
    },
    timeline: options => dam.composeTimelines({
      'rotate-2d': {
        start: (options.from === 'left' ? -1 : 1) * 200 * options.intensity,
        end: 0
      }
    })
  });
  dam.defineEffect('rotate-out', {
    timeline: options => dam.composeTimelines({
      'rotate-in': {
        ...options,
        reverse: true
      }
    })
  });

  // scale

  dam.defineEffect('scale', {
    defaultOptions: {
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      from: 0,
      to: 1
    },
    tween: _ref => {
      let {
        from,
        to
      } = _ref;
      return {
        start: {
          'transform': "scale(".concat(from, ",").concat(from, ")")
        },
        end: {
          'transform': "scale(".concat(to, ", ").concat(to, ")")
        }
      };
    }
  });
  dam.defineEffect('zoom-in', {
    defaultOptions: {
      from: 1
    },
    timeline: options => dam.composeTimelines({
      'scale': {
        from: options.from,
        to: options.from + 2 * options.intensity
      }
    })
  });
  dam.defineEffect('zoom-out', {
    timeline: options => dam.composeTimelines({
      'zoom-in': {
        ...options,
        reverse: true
      }
    })
  });

  // fade

  dam.defineEffect('fade', {
    defaultOptions: {
      from: 1,
      to: 0
    },
    tween: _ref2 => {
      let {
        from,
        to
      } = _ref2;
      return {
        start: {
          'opacity': from
        },
        end: {
          'opacity': to
        }
      };
    }
  });
  dam.defineEffect('fade-in', {
    defaultOptions: {
      from: 0
    },
    timeline: options => dam.composeTimelines({
      'fade': {
        from: options.from,
        to: options.to || options.from + (1 - options.from) * options.intensity
      }
    })
  });
  dam.defineEffect('fade-out', {
    defaultOptions: {
      from: 1
    },
    timeline: options => dam.composeTimelines({
      'fade': {
        from: options.from,
        to: options.to || options.from * (1 - options.intensity)
      }
    })
  });

  // color

  dam.defineEffect('color-switch', {
    defaultOptions: {
      fromColor: '#000',
      toColor: '#00F'
    },
    tween: _ref3 => {
      let {
        fromColor,
        toColor
      } = _ref3;
      return {
        start: {
          color: fromColor
        },
        end: {
          color: toColor
        }
      };
    }
  });
  dam.defineEffect('bg-color-switch', {
    defaultOptions: {
      fromColor: '#000',
      toColor: '#00F'
    },
    tween: _ref4 => {
      let {
        fromColor,
        toColor
      } = _ref4;
      return {
        start: {
          'background-color': fromColor
        },
        end: {
          'background-color': toColor
        }
      };
    }
  });

  // complex effects

  dam.defineEffect('bounce-in', {
    defaultOptions: {
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      from: 'left'
    },
    timeline: options => {
      const sign = ['left', 'up'].includes(options.from) ? -1 : 1;
      const axis = ['left', 'right'].includes(options.from) ? 'x' : 'y';
      const xyVals = val => axis === 'y' ? "0, ".concat(val * options.intensity * sign, "px") : "".concat(val * options.intensity * sign, "px, 0");
      return {
        0: {
          transform: "translate3d(".concat(xyVals(3000), ", 0) scaleX(").concat(1 + 2 * options.intensity, ")")
        },
        60: {
          transform: "translate3d(".concat(xyVals(-25), ", 0) scaleX(1)")
        },
        75: {
          transform: "translate3d(".concat(xyVals(10), ", 0) scaleX(", 0.98, ")")
        },
        100: {
          transform: 'translate3d(0, 0, 0) scaleX(1)'
        }
      };
    }
  });
  dam.defineEffect('bounce', {
    defaultOptions: {
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    timeline: _ref5 => {
      let {
        intensity
      } = _ref5;
      const round = num => Math.round((num + Number.EPSILON) * 100) / 100;
      const scale1 = round(1 - 0.7 * intensity);
      const scale2 = round(1 + 0.1 * intensity);
      const scale3 = round(1 - 0.1 * intensity);
      const scale4 = round(1 + 0.03 * intensity);
      const scale5 = round(1 - 0.03 * intensity);
      return {
        0: {
          transform: "scale3d(".concat(scale1, ", ").concat(scale1, ", ").concat(scale1, ")")
        },
        20: {
          transform: "scale3d(".concat(scale2, ", ").concat(scale2, ", ").concat(scale2, ")")
        },
        40: {
          transform: "scale3d(".concat(scale3, ", ").concat(scale3, ", ").concat(scale3, ")")
        },
        60: {
          transform: "scale3d(".concat(scale4, ", ").concat(scale4, ", ").concat(scale4, ")")
        },
        80: {
          transform: "scale3d(".concat(scale5, ", ").concat(scale5, ", ").concat(scale5, ")")
        },
        100: {
          transform: 'scale3d(1, 1, 1)'
        }
      };
    }
  });
  dam.defineEffect('jello', {
    defaultOptions: {
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    timeline: _ref6 => {
      let {
        intensity
      } = _ref6;
      return {
        '0': {
          transform: "skewX(".concat(-12.5 * intensity, "deg) skewY(").concat(-12.5 * intensity, "deg)")
        },
        '16.66': {
          transform: "skewX(".concat(6.25 * intensity, "deg) skewY(").concat(6.25 * intensity, "deg)")
        },
        '33.33': {
          transform: "skewX(".concat(-3.125 * intensity, "deg) skewY(").concat(-3.125 * intensity, "deg)")
        },
        '50': {
          transform: "skewX(".concat(1.5625 * intensity, "deg) skewY(").concat(1.5625 * intensity, "deg)")
        },
        '66.66': {
          transform: "skewX(".concat(-0.78125 * intensity, "deg) skewY(").concat(-0.78125 * intensity, "deg)")
        },
        '83.33': {
          transform: "skewX(".concat(0.390625 * intensity, "deg) skewY(").concat(0.390625 * intensity, "deg)")
        },
        '100.00': {
          transform: 'skewX(0deg) skewY(0deg)'
        }
      };
    }
  });
}

//# sourceURL=webpack:///./src/built-in-effects.js?