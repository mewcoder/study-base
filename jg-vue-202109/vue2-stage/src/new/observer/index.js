import { isObject } from "../../utils/index";

import { arrayMethods } from "./array";

export function observe(data) {
  if (!isObject(data)) return;
  if (data.__ob__) {
    //如果已经被劫持过了，就不再劫持
    return;
  }
  return new Observer(data);
}

class Observer {
  constructor(data) {
    // 给data设置一个__ob__属性，
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false, // 不可枚举
    });

    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods; // 将数组的原型方法指向arrayMethods
      this.observeArray(data);
    }
    this.walk(data);
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
  observeArray(data) {
    data.forEach((item) => observe(item));
  }
}

function defineReactive(data, key, value) {
  observe(value); // 如果是对象，递归调用
  Object.defineProperty(data, key, {
    get() {
      console.log("get:" + key + ":" + value);
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      value = newValue;
      observe(newValue); //如果赋值的是对象，劫持该对象
    },
  });
}
