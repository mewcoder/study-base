let oldArrayProtoMethods = Array.prototype;
export let arrayMethods = Object.create(Array.prototype);

let method = ["push", "shift", "unshift", "pop", "reverse", "sort", "splice"];

method.forEach((method) => {
  arrayMethods[method] = function (...args) {
    oldArrayProtoMethods[method].call(this, ...args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        insertd = args;
        break;
      case "splice":
        insertd = args.slice(2);
        break;

      default:
        break;
    }
    if (inserted) ob.observeArray(inserted); // 对新增的每一项进行观测
  };
});
