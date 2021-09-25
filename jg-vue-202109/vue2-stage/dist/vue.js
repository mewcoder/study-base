(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(val) {
    return val !== null && _typeof(val) === "object";
  }

  var oldArrayPrototype = Array.prototype;
  var arrayMethods = Object.create(oldArrayPrototype);
  var methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayPrototype[method].apply(this, args);
      console.log(this);
      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case "push":
        case "unshift":
          inserted = args; // 新增的元素

          break;

        case "splice":
          inserted = args.slice(2); // 新增的元素

          break;
      } // 这里如何劫持新增的元素？


      if (inserted) {
        console.log(this);
        ob.observeArray(inserted); //获取方法
      }

      return result;
    };
  });

  function observe(data) {
    if (!isObject(data)) return;

    if (data.__ob__) {
      //如果已经被劫持过了，就不再劫持
      return;
    }

    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 给data设置一个__ob__属性，
      Object.defineProperty(data, "__ob__", {
        value: this,
        enumerable: false // 不可枚举

      });

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods; // 将数组的原型方法指向arrayMethods

        this.observeArray(data);
      }

      this.walk(data);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); // 如果是对象，递归调用

    Object.defineProperty(data, key, {
      get: function get() {
        console.log("get:" + key + ":" + value);
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        value = newValue;
        observe(newValue); //如果赋值的是对象，劫持该对象
      }
    });
  }

  function initState(vm) {
    var opt = vm.$options;

    if (opt.data) {
      initData(vm); //初始化data
    }
  }

  function initData(vm) {
    var data = vm.$options.data; // 通过_data将data挂载到vm上
    // 如果data是函数，则执行函数，获取到data

    data = vm._data = typeof data === "function" ? data.call(vm) : data; // 代理，可以通过vm.xxx访问data中的属性

    for (var key in data) {
      proxy(vm, "_data", key);
    }

    observe(data); //数据劫持
  } // 代理函数


  function proxy(target, source, key) {
    Object.defineProperty(target, key, {
      get: function get() {
        return target[source][key];
      },
      set: function set(newVal) {
        target[source][key] = newVal;
      }
    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm); // 初始化状态
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // 给Vue添加了一个_init方法

  return Vue;

}));
//# sourceMappingURL=vue.js.map
