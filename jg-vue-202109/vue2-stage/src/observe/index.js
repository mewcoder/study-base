import { arrayMethods } from "../array";
import { isObject } from "../utils";

class Observer {
  constructor(data) {
    //传递this
    Object.defineProperties(data, "__ob__", {
      value: this,
      enumerable: false,
    });
    if (Array.isArray(data)) {
      // 劫持数组原型方法
      data.__proto__ = arrayMethods;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  observeArray(data) {
    data.forEach((item) => {
      observe(item);
    });
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

function defineReactive(data, key, val) {
  observe(val); // 递归
  // const dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      // dep.depend();
      return val;
    },
    set(newVal) {
      observe(newVal);
      if (newVal === val) return;
      val = newVal;
      // dep.notify();
    },
  });
}

export function observe(data) {
  if (!isObject(data)) {
    return;
  }

  if (data.__ob__) {
    return;
  }
  return new Observer(data);
}
