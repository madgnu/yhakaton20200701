export default function (node, k, v) {
  if (k == "className") {
    node[k] = v;
  } else if (k == "style") {
    Object.assign(node[k], v);
  } else if (k.startsWith("on")) {
    const eventType = k.slice(2).toLowerCase();
    node.__eventListeners = node.__eventListeners || {};
    node.removeEventListener(eventType, node.__eventListeners[eventType]);
    node.__eventListeners[eventType] = v;
    node.addEventListener(eventType, v);
  } else if (k === "key") {
    node.__key = v;
  } else if (k === "ref") {
    v(node);
  } else if (typeof v !== "object" && typeof v !== "function") {
    node.setAttribute(k, v);
  }
  node.__props = node.__props || {};
  node.__props[k] = v;
}
