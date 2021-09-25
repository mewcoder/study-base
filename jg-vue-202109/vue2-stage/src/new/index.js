import { initMixin } from "./init";

function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 给Vue添加了一个_init方法

export default Vue;
