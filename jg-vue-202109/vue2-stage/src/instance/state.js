import { isFunction } from "../utils";
import { observe } from "./observe";

export function initState(vm) {
  const opts = vm.$options;
  // 如果有data，则设置data
  if (opts.data) {
    initData(vm);
  }

  if (opts.computed) {
    initComputed(vm);
  }

  if (opts.methods) {
    initMethod(vm);
  }

  if (opts.props) {
    initProps(vm);
  }

  if (opts.watch) {
    initWatch(vm);
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    },
  });
}

//初始化数据
function initData(vm) {
  let data = vm.$options.data;
  //可能是函数
  data = vm._data = isFunction(data) ? data.call(vm) : data;

  //把 data里的数据 代理到vm上
  for (let key in data) {
    proxy(vm, "_data", key);
  }


  observe(data);
}
