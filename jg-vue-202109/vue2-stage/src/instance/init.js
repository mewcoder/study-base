export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    initState(vm); //初始化数据

    if (vm.$options.el) {
      //将数据挂载到这个模块上
      vm.$mount(vm.$options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;

    el = document.querySelector(el);
    vm.$el = el;
    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;
        let render = compileToFunctions(template); //把模块转换成 对应的渲染函数
        options.render = render;
      }
    }

    // 挂载组件
    mountComponent(vm, el);
  };
}
