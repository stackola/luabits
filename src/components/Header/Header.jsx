import React from "react";
import style from "./Header.less";
import { Link } from "react-router-dom";
export default class Header extends React.Component {
  render() {
    return (
      <div styleName="Header">
        <div styleName="inner">
          <Link styleName="logo" to={"/"}>
            luabits.com
          </Link>
          <div>| alpha</div>
        </div>
      </div>
    );
  }
}
