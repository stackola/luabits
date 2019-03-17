import React from "react";
import style from "./Bucket.less";

export default class Bucket extends React.Component {
  render() {
    return <div styleName="Bucket">{this.props.children}</div>;
  }
}
