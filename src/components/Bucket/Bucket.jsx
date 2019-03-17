import React from "react";
import style from "./Bucket.less";
import { Link } from "react-router-dom";

export default class Bucket extends React.Component {
  render() {
    return (
      <Link
        to={
          "/project/view/" +
          this.props.project +
          "/bucket/" +
          this.props.children
        }
        styleName="Bucket"
      >
        {this.props.children}
      </Link>
    );
  }
}
