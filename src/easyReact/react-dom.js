// vnode 虚拟dom节点
// node dom节点
function isStringOrNumber(vnode) {
  return typeof vnode === "string" || typeof vnode == "number" ? true : false;
}
function render(vnode, container) {
  console.log("vnode", vnode);
  const node = createNode(vnode);
  container.appendChild(node);
}

function createNode(vnode) {
  let node;
  // * 根据虚拟dom节点type判断生成dom类型
  const { type } = vnode;
  // todo 根据虚拟dom节点生成真实dom节点
  if (typeof type === "string") {
    // 原生标签节点 div\a\section
    node = updateHostComponent(vnode);
  } else if (isStringOrNumber(vnode)) {
    node = updateTextComponent(vnode);
  } else if (typeof type === "function") {
    node = type.prototype.isReactComponent
      ? updateClassComponent(vnode)
      : updateFunctionComponent(vnode);
  } else {
    node = updateFragmentComponent(vnode);
  }
  return node;
}
// * 设置节点标签属性
function updateNode(node, propVal) {
  Object.keys(propVal)
    .filter((k) => k != "children")
    .forEach((k) => {
      node[k] = propVal[k];
    });
}
function updateHostComponent(vnode) {
  const { type, props } = vnode;
  const node = document.createElement(type);
  updateNode(node, props);
  reconcileChildren(node, props.children);
  return node;
}

function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode);
  return node;
}

function updateFunctionComponent(vnode) {
  const { type, props } = vnode;
  const child = type(props);
  const node = createNode(child);
  return node;
}

function updateClassComponent(vnode) {
  const { type, props } = vnode;
  const instance = new type(props);
  const child = instance.render();
  const node = createNode(child);
  return node;
}

function updateFragmentComponent(vnode) {
  // ! 源码当中并没有使用createDocumentFragment，而是直接处理子节点
  const node = document.createDocumentFragment();
  reconcileChildren(node, vnode.props.children);
  return node;
}

function reconcileChildren(parentNode, children) {
  const newChildren = Array.isArray(children) ? children : [children];
  for (let i = 0; i < newChildren.length; i++) {
    render(newChildren[i], parentNode);
  }
}

export default { render };
