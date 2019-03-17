import React from "react";
import style from "./Title.less";

export default class Title extends React.Component {
  render() {
    return <div styleName="Title">{this.props.children}</div>;
  }
}
