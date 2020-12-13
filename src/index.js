import React from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "./easyReact/react-dom";
import Component from "./easyReact/Component";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <p>{this.props.name}</p>
      </div>
    );
  }
}

function FunctionComponent(props) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  );
}

function FragmentComponent(props) {
  return (
    <>
      <li>1</li>
      <li>2</li>
    </>
  );
}
const jsx = (
  // <section className="border">
  //   <h1>测试react</h1>
  //   <h1>练习</h1>

  //   <a href="http://baidu.com">百度一下</a>
  // </section>
  <section className="border">
    <h1>慢慢慢</h1>
    <h1>全栈</h1>
    <a href="https://www.kaikeba.com/">kkb</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
    <>
      <h1>1</h1>
      <h2>2</h2>
    </>
    <ul>
      <FragmentComponent />
    </ul>
  </section>
);
ReactDOM.render(jsx, document.getElementById("root"));
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
