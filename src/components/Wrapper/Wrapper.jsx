import React from "react";
import style from "./Wrapper.less";
import Title from "../Title/Title";
import BackToProject from "../BackToProject/BackToProject";

export default class Wrapper extends React.Component {
  render() {
    return (
      <div styleName="Wrapper">
        {this.props.showBack && <BackToProject />}
        {this.props.title && <Title>{this.props.title}</Title>}
        {this.props.children}
      </div>
    );
  }
}
