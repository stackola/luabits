import React from "react";
import style from "./Header.less";

export default class Header extends React.Component {
  render() {
    return (
      <div styleName="Header">
        <div styleName="inner">
          <div styleName="logo">luabits.com</div>
          <div>| alpha</div>
        </div>
      </div>
    );
  }
}
