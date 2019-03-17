import React from "react";
import style from "./BigInput.less";

export default class BigInput extends React.Component {
  render() {
    return (
      <>
        <div styleName="label">{this.props.label}</div>
        <input styleName="BigInput" />
      </>
    );
  }
}
