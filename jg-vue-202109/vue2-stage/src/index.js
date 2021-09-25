import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 给Vue添加了一个_init方法

renderMixin(Vue);

lifecycleMixin(Vue);

export default Vue;
