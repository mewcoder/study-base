const oldArrayPrototype = Array.prototype;

export let arrayMethods = Object.create(oldArrayPrototype);

const methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "reverse",
  "sort",
  "splice",
];

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    const result = oldArrayPrototype[method].apply(this, args);
    console.log(this);
    let inserted;
    const ob = this.__ob__;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args; // 新增的元素
        break;
      case "splice":
        inserted = args.slice(2); // 新增的元素
        break;
    }
    // 这里如何劫持新增的元素？
    if (inserted) {
      console.log(this);
      ob.observeArray(inserted); //获取方法
    }
    return result;
  };
});
