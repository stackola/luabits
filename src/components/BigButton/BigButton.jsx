import React from "react";
import style from "./BigButton.less";
import { Link } from "react-router-dom";
export default class BigButton extends React.Component {
  render() {
    if (this.props.route) {
      return (
        <Link styleName="BigButton" to={this.props.route}>
          {this.props.children}
        </Link>
      );
    } else {
      return (
        <div
          styleName="BigButton"
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
