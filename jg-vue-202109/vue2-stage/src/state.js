import { observe } from "./observer/index";

export function initState(vm) {
  const opt = vm.$options;
  if (opt.data) {
    initData(vm); //初始化data
  }
}

function initData(vm) {
  let data = vm.$options.data;

  // 通过_data将data挂载到vm上
  // 如果data是函数，则执行函数，获取到data
  data = vm._data = typeof data === "function" ? data.call(vm) : data;

  // 代理，可以通过vm.xxx访问data中的属性
  for (const key in data) {
    proxy(vm, "_data", key);
  }

  observe(data); //数据劫持
}

// 代理函数
function proxy(target, source, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[source][key];
    },
    set(newVal) {
      target[source][key] = newVal;
    },
  });
}
