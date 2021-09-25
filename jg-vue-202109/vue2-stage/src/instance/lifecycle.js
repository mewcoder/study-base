export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  };
}

export function mountComponent(vm, el) {
  vm.$el = el;
  //更新函数 数据变化后 会再次调用此函数
  let updateComponent = () => {
    // 调用render函数，生成虚拟dom
    vm._update(vm._render());
    // 用虚拟dom 生成真实dom
  };
  updateComponent();
}
