import Component from "./component.js";
import applyAttribute from "./applyAttribute.js";

function render(vdom, parent) {
  if (typeof vdom === "string") {
    return parent.appendChild(document.createTextNode(vdom));
  } else if (typeof vdom === "object" && typeof vdom.type === "string") {
    const node = parent.appendChild(document.createElement(vdom.type));
    for (let [k, v] of Object.entries(vdom.props)) applyAttribute(node, k, v);
    Array.isArray(vdom.children) &&
      vdom.children.forEach((e) => render(e, node));
    return node;
  } else if (typeof vdom === "object" && typeof vdom.type === "function") {
    return Component.render(vdom, parent);
  }
}

export default render;
