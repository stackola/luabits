import React from "react";
import style from "./Header.less";
import { Link } from "react-router-dom";
export default class Header extends React.Component {
  render() {
    return (
      <div styleName="Header">
        <div styleName="inner">
          <div styleName="logoWrapper">
            <Link styleName="logo" to={"/"}>
              luabits.com
            </Link>
            <div>| pre-pre-alpha</div>
          </div>
          <div styleName="flexSpacer" />
          <div styleName="nav">
            <Link to="/" styleName="navItem">
              Home
            </Link>
            <Link to="/projects" styleName="navItem">
              Your projects
            </Link>
            <Link to="/getting-started" styleName="navItem">
              Getting started
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
