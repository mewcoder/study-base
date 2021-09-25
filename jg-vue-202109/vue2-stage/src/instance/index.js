import { initMixin } from "./init";

function Vue(options) {
  this._init(options); //初始化
}

initMixin(Vue); //给原型加 init方法

renderMixin(); // _render

lifecycleMixin(); // _update

export default Vue;
