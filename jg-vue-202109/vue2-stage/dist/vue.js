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

      // 给data设置一个__ob__属性，表示Observer实例
      // 还有一个作用表示该对象是否被劫持过
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

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}
  // html字符串 =》 字符串  _c('div',{id:'app',a:1},'hello')

  function genProps(attrs) {
    // [{name:'xxx',value:'xxx'},{name:'xxx',value:'xxx'}]
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          // color:red;background:blue
          var styleObj = {};
          attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
            styleObj[arguments[1]] = arguments[2];
          });
          attr.value = styleObj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(el) {
    if (el.type == 1) {
      // element = 1 text = 3
      return generate(el);
    } else {
      var text = el.text;

      if (!defaultTagRE.test(text)) {
        return "_v('".concat(text, "')");
      } else {
        // 'hello' + arr + 'world'    hello {{arr}} {{aa}} world
        var tokens = [];
        var match;
        var lastIndex = defaultTagRE.lastIndex = 0; // CSS-LOADER 原理一样

        while (match = defaultTagRE.exec(text)) {
          // 看有没有匹配到
          var index = match.index; // 开始索引

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")")); // JSON.stringify()

          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function genChildren(el) {
    var children = el.children; // 获取儿子

    if (children) {
      return children.map(function (c) {
        return gen(c);
      }).join(',');
    }

    return false;
  }

  function generate(el) {
    //  _c('div',{id:'app',a:1},_c('span',{},'world'),_v())
    // 遍历树 将树拼接成字符串
    var children = genChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名 

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //  用来获取的标签名的 match后的索引为1的

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配开始标签的 

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配闭合标签的
  //           aa  =   "  xxx "  | '  xxxx '  | xxx

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'

  var startTagClose = /^\s*(\/?)>/; //     />   <div/>
  // ast (语法层面的描述 js css html) vdom （dom节点）
  // html字符串解析成 对应的脚本来触发 tokens  <div id="app"> {{name}}</div>
  // 将解析后的结果 组装成一个树结构  栈

  function createAstElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      parent: null,
      attrs: attrs
    };
  }

  var root = null;
  var stack = [];

  function start(tagName, attributes) {
    var parent = stack[stack.length - 1];
    var element = createAstElement(tagName, attributes);

    if (!root) {
      root = element;
    }

    if (parent) {
      element.parent = parent; // 当放入栈中时 继续父亲是谁

      parent.children.push(element);
    }

    stack.push(element);
  }

  function end(tagName) {
    var last = stack.pop();

    if (last.tag !== tagName) {
      throw new Error('标签有误');
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, "");
    var parent = stack[stack.length - 1];

    if (text) {
      parent.children.push({
        type: 3,
        text: text
      });
    }
  }

  function parserHTML(html) {
    function advance(len) {
      html = html.substring(len);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var _end; // 如果没有遇到标签结尾就不停的解析


        var attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match;
      }

      return false; // 不是开始标签
    }

    while (html) {
      // 看要解析的内容是否存在，如果存在就不停的解析
      var textEnd = html.indexOf('<'); // 当前解析的开头  

      if (textEnd == 0) {
        var startTagMatch = parseStartTag(); // 解析开始标签

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      }

      var text = void 0; // //  </div>

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        chars(text);
        advance(text.length);
      }
    }

    return root;
  } // 看一下用户是否传入了 , 没传入可能传入的是 template, template如果也没有传递
  // 将我们的html =》 词法解析  （开始标签 ， 结束标签，属性，文本）
  // => ast语法树 用来描述html语法的 stack=[]
  // codegen  <div>hello</div>  =>   _c('div',{},'hello')  => 让字符串执行
  // 字符串如果转成代码 eval 好性能 会有作用域问题
  // 模板引擎 new Function + with 来实现

  function compileToFunction(template) {
    var root = parserHTML(template); // 生成代码

    var code = generate(root); // code 中会用到数据 数据在vm上

    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  function patch(oldVnode, vnode) {
    if (oldVnode.nodeType == 1) {
      // 用vnode  来生成真实dom 替换原本的dom元素
      var parentElm = oldVnode.parentNode; // 找到他的父亲

      var elm = createElm(vnode); //根据虚拟节点 创建元素

      parentElm.insertBefore(elm, oldVnode.nextSibling);
      parentElm.removeChild(oldVnode);
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag;
        vnode.data;
        var children = vnode.children,
        text = vnode.text;
        vnode.vm;

    if (typeof tag === "string") {
      // 元素
      vnode.el = document.createElement(tag); // 虚拟节点会有一个el属性 对应真实节点

      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    // 更新函数
    var updateComponent = function updateComponent() {
      //调用render方法,生成虚拟dom
      vm._update(vm._render());
    };

    updateComponent();
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm); // 初始化状态
      // 页面挂载

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    }; // 为了方便把，mount写在这里


    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      vm.$el = el;

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          // 如果没有模板，就把el的html作为模板
          template = el.outerHTML; // 将template编译成render函数
        } // 将template编译成render函数


        var render = compileToFunction(template); // 这部分先忽略学习
        // console.log(render);

        options.render = render;
      } // 挂载


      mountComponent(vm);
    };
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vnode(vm, tag, data, data.key, children, undefined);
  }
  function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, data, key, children, text) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text // .....

    };
  }

  function renderMixin(Vue) {
    Vue.prototype._v = function (text) {
      // 创建文本
      return createTextElement(text);
    };

    Vue.prototype._c = function () {
      // 创建元素
      return createElement.apply(void 0, arguments);
    };

    Vue.prototype._s = function (val) {
      return val == null ? "" : _typeof(val) === "object" ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // 给Vue添加了一个_init方法

  renderMixin(Vue);
  lifecycleMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
