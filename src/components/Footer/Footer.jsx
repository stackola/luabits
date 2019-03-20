import React from "react";
import style from "./Footer.less";

export default class Footer extends React.Component {
  render() {
    return (
      <div styleName="Footer">
        made by stackola | <a href="https://github.com/stackola">github</a> |{" "}
        <a href="https://twitter.com/Stackola_">twitter</a>
      </div>
    );
  }
}
