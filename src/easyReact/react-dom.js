// vnode 虚拟dom节点
// node dom节点

// * vnode

// type 原生标签 string
//      文本节点 没有type
//      函数组件 函数
//      类组件   类
// props 属性 如className 、 href、 id、children等


// * 
// fiber结构
// type 类型
// props 属性
// child 第一个子节点  fiber
// sibling 下一个兄弟节点 fiber
// return 父节点 fiber
// stateNode 原生标签的dom节点
// *

// wipRoot 正在工作的fiber根节点
let wipRoot = null;
// 下一个要渲染更新的任务 fiber
let nextUnitOfWork = null;
// work in progress
function isStringOrNumber(vnode) {
  return typeof vnode === "string" || typeof vnode == "number" ? true : false;
}
function render(vnode, container) {
  console.log("vnode", vnode);
  // const node = createNode(vnode);
  // container.appendChild(node);
  wipRoot = {
    type: "div",
    props: {
      children: {...vnode}
    },
    stateNode: container,
  };
  nextUnitOfWork = wipRoot;
}
// 创建原生标签dom节点
function createNode(workInProgress) {
  const { type,props } = workInProgress;
  let node = document.createElement(type);
  updateNode(node,props);
  return node;
}
// * 设置节点标签属性
function updateNode(node, propVal) {
  Object.keys(propVal)
    // .filter((k) => k != "children")
    .forEach((k) => {
      if(k === 'children') {
        if(isStringOrNumber(propVal[k])) {
          node.textContent = propVal[k] + '';
        }
      } else {
        node[k] = propVal[k];

      }
    });
}
function updateHostComponent(workInProgress) {

  if(!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress)
  }
  console.log(workInProgress,workInProgress.props.children,'updateHostComponent')

  // 协调子节点
  reconcileChildren(workInProgress,workInProgress.props.children);

}


// 函数组件
// 拿到子节点，然后协调
function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress;
  const child = type(props);
  console.log(workInProgress,child,'updateFunctionComponent')

  reconcileChildren(workInProgress,child)
}

function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress;
  const instance = new type(props);
  const child = instance.render();
  console.log(workInProgress,child,'updateClassComponent')

  reconcileChildren(workInProgress,child)
}

function updateFragmentComponent(workInProgress) {
  // ! 源码当中并没有使用createDocumentFragment，而是直接处理子节点
  console.log(workInProgress,workInProgress.props.children,'updateFragmentComponent')

  reconcileChildren(workInProgress, workInProgress.props.children);
}

function reconcileChildren(workInProgress, children) {
  if(isStringOrNumber(children)) {
    return;
  }
  const newChildren = Array.isArray(children) ? children : [children];
  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    let newFiber = {
      type: child.type,
      props: {...child.props},
      child: null,
      sibling: null,
      return: workInProgress,
      stateNode: null
    }
    if(i === 0) {
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}
// 协调子节点


function performUnitOfWork(workInProgress) {
  // 1、渲染更新fiber
  const { type } = workInProgress;
  if (typeof type === "string") {
    // 原生标签节点 div\a\section
    updateHostComponent(workInProgress);
  } else if (typeof type === "function") {
    type.prototype.isReactComponent
      ? updateClassComponent(workInProgress)
      : updateFunctionComponent(workInProgress);
  } else {
     updateFragmentComponent(workInProgress);
  }
  // 2、返回下一个更新fiber
  // 有长子
  if(workInProgress.child) {
    return workInProgress.child;
  }
  let nextFiber = workInProgress;
  // 没有孩子有兄弟节点选择兄弟节点，没有寻找父兄弟节点以此类推
  while(nextFiber) {
    if(nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.return;
  }
}

function workLoop(IdleDeadline) {
  while(nextUnitOfWork && IdleDeadline.timeRemaining()>1) {
    // 渲染更新fiber,并返回下一个
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  // commit
  if(!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(workInProgress) {
  if(!workInProgress) {
    return;
  }
  // 1、渲染更新自己
  // vnode=>node，node更新到container
  let parentNodeFiber = workInProgress.return;
  // fiber节点不一定都有dom节点，比如consumer、fragment
  while(!parentNodeFiber.stateNode) {
    parentNodeFiber = parentNodeFiber.return;
  } 
  let parentNode = parentNodeFiber.stateNode;
  if(workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode)
  } 
  // 2、渲染更新子节点
  commitWork(workInProgress.child);
  // 3、渲染更细sibling
  commitWork(workInProgress.sibling)
}

requestIdleCallback(workLoop)
export default { render };

