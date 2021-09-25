import { initState } from "./state.js";
import { compileToFunction } from "./compiler/index";
import { mountComponent } from "./lifecycle";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    initState(vm); // 初始化状态

    // 页面挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };

  // 为了方便把，mount写在这里
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    vm.$el = el;

    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        // 如果没有模板，就把el的html作为模板
        template = el.outerHTML;
        // 将template编译成render函数
      }
      // 将template编译成render函数
      const render = compileToFunction(template); // 这部分先忽略学习
      // console.log(render);
      options.render = render;
    }

    // 挂载
    mountComponent(vm, el);
  };
}
