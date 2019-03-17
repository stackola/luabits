import React from "react";
import style from "./FuncRow.less";

import { Link } from "react-router-dom";
export default class FuncRow extends React.Component {
  render() {
    return (
      <Link
        to={
          "/project/view/" +
          this.props.project +
          "/editFunction/" +
          this.props.name
        }
        styleName="FuncRow"
      >
        {this.props.name}
      </Link>
    );
  }
}
