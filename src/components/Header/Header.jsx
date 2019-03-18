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
          <div style={{ flex: 1 }} />
          <div styleName="nav">
            <Link to="/" styleName="navItem">
              Home
            </Link>
            <Link to="/getting-started" styleName="navItem">
              Getting started
            </Link>
            <Link to="/pricing" styleName="navItem">
              Pricing
            </Link>
            <Link to="/examples" styleName="navItem">
              Examples
            </Link>
            <Link to="/docs" styleName="navItem">
              Docs
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
