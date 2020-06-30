import render from "./render.js";
import applyAttribute from "./applyAttribute.js";

function patch(vdom, node, parent = node.parentNode) {
  const replace = (newNode) => parent.replaceChild(newNode, node) && newNode;
  if (typeof vdom === "object" && typeof vdom.type === "function") {
    return Component.patch(vdom, node, parent);
  } else if (typeof vdom === "string" && node instanceof Text) {
    return node.textContent !== vdom ? replace(render(vdom, parent)) : node;
  } else if (typeof vdom === "object" && node instanceof Text) {
    return replace(render(vdom, parent));
  } else if (
    typeof vdom === "object" &&
    vdom.type.toUpperCase() !== node.nodeName
  ) {
    return replace(render(vdom, parent));
  } else if (
    typeof vdom === "object" &&
    vdom.type.toUpperCase() === node.nodeName
  ) {
    const activeNode = document.activeElement;
    const keyChields = {};
    node.childNodes.forEach(
      (el, i) => (keyChields[`${el.__key || `__DUMMY_KEY__${i}`}`] = el)
    );
    vdom.children.forEach((el, i) => {
      const key = (el.props && el.props.key) || `__DUMMY_KEY__${i}`;
      node.appendChild(
        keyChields[key] ? patch(el, keyChields[key]) : render(el, node)
      );
      delete keyChields[key];
    });
    for (let k in keyChields) keyChields[k].remove();

    const vdomPropsDiff = { ...vdom.props };

    for (let propName in node.__props) {
      if (typeof node.__props[propName] === "function") continue;
      if (node.__props[propName] === vdomPropsDiff[propName]) {
        delete vdomPropsDiff[propName];
        continue;
      } else if (
        typeof node.__props[propName] === "object" &&
        typeof (vdomPropsDiff[propName] === "object") &&
        JSON.stringify(node.__props[propName]) ===
          JSON.stringify(vdomPropsDiff[propName])
      ) {
        delete vdomPropsDiff[propName];
        continue;
      }
      const domPropName = propName === "className" ? "class" : propName;
      node.removeAttribute(domPropName);
    }

    for (let propName in vdomPropsDiff)
      applyAttribute(node, propName, vdom.props[propName]);
    activeNode.focus();
    return node;
  }
}

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = null;
  }

  static render(vdom, parent) {
    const props = Object.assign({}, vdom.props, { children: vdom.children });
    if (Component.isPrototypeOf(vdom.type)) {
      const instance = new vdom.type(props);
      const node = render(instance.render(), parent);
      node.__instance = instance;
      node.__key = vdom.props.key;
      instance.__node = node;
      instance.componentDidMount();
      return node;
    } else return render(vdom.type(props), parent);
  }

  static patch(vdom, node, parent = node.parentNode) {
    const props = Object.assign({}, vdom.props, { children: vdom.children });
    if (node.__instance && node.__instance.constructor === vdom.type) {
      node.__instance.props = props;
      return patch(node.__instance.render(), node, parent);
    } else if (Component.isPrototypeOf(vdom.type)) {
      const newNode = Component.render(vdom, parent);
      return parent ? parent.replaceChild(newNode, node) : newNode;
    } else return patch(vdom.type(props), node, parent);
  }

  setState(nextState) {
    if (typeof this.state !== "object") this.state = {};
    if (this.__node) {
      const newState = Object.assign({}, this.state, nextState);
      const oldState = this.state;
      this.componentWillUpdate(this.props, nextState);
      this.state = newState;
      patch(this.render(), this.__node);
      this.componentDidUpdate(this.props, oldState);
    }
  }

  componentDidMount() {
    return undefined;
  }

  componentWillUpdate() {
    return undefined;
  }

  componentDidUpdate() {
    return undefined;
  }
}

export default Component;
