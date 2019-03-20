import React from "react";
import style from "./BigButton.less";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
export default class BigButton extends React.Component {
  render() {
    if (this.props.loading) {
      return (
        <div styleName={"BigButton " + (this.props.big ? "big" : "")}>
          <ReactLoading type={"spin"} color={"white"} height={20} width={20} />
        </div>
      );
    }
    if (this.props.route) {
      return (
        <Link
          styleName={"BigButton " + (this.props.big ? "big" : "")}
          to={this.props.route}
        >
          {this.props.children}
        </Link>
      );
    } else {
      return (
        <div
          styleName={"BigButton " + (this.props.big ? "big" : "")}
          onClick={() => {
            this.props.onClick && this.props.onClick();
          }}
        >
          {this.props.children}
        </div>
      );
    }
  }
}
