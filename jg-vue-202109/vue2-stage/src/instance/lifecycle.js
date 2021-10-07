import { patch } from "../vdom/patch";
import Watcher from "../observer/watcher";
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    // 既有初始化 又又更新
    const vm = this;

    vm.$el = patch(vm.$el, vnode);
  };
}
export function mountComponent(vm, el) {
  // 更新函数 数据变化后 会再次调用此函数
  let updateComponent = () => {
    // 调用render函数，生成虚拟dom
    vm._update(vm._render()); // 后续更新可以调用updateComponent方法
    // 用虚拟dom 生成真实dom
  };
  // updateComponent();

  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log("视图更新了");
    },
    true
  );

  // true表示为渲染watcher
}
