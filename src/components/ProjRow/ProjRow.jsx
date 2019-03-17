import React from "react";
import style from "./ProjRow.less";

import { Link } from "react-router-dom";
export default class ProjRow extends React.Component {
  render() {
    return (
      <Link to={"/project/view/" + this.props.id} styleName="ProjRow">
        {this.props.name}
      </Link>
    );
  }
}
