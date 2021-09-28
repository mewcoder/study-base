import { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
      this.deps = [];
      this.depsId = new Set();
    }
    this.cb = cb;
    this.id = ++id;
    this.options = options;
    this.get();
  }
  get() {
    pushTarget(this);
    this.getter();
    popTarget();
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
