import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

function Vue(options) {
  //options为用户传入的选项
  this._init(options);
}

initMixin(Vue); // 给Vue添加了一个_init方法

renderMixin(Vue); //_render方法 生成vdom

lifecycleMixin(Vue); //_update方法 转为 真实dom

export default Vue;
