import React from "react";
import style from "./Wrapper.less";
import Title from "../Title/Title";

export default class Wrapper extends React.Component {
  render() {
    return (
      <div styleName="Wrapper">
        <Title>{this.props.title}</Title>
        {this.props.children}
      </div>
    );
  }
}
