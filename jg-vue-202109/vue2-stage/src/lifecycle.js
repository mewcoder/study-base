import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    patch(vm.$el, vnode);
  };
}

export function mountComponent(vm, el) {
  // 更新函数
  const updateComponent = () => {
    //调用render方法,生成虚拟dom
    vm._update(vm._render());
  };

  updateComponent();
}
