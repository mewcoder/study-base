import { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher {
  // 第二个参数可能是表达式
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
      this.deps = [];
      this.depsId = new Set();
    }
    this.cb = cb;
    this.options = options;
    this.id = id++;

    this.get(); // 默认让 exprOrFn 执行, render执行时会进行取值
  }
  get() {
    pushTarget(this);
    this.getter();
    popTarget();
  }
  update(){
    this.get();
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
}

export default Watcher;
