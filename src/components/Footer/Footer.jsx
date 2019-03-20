import React from "react";
import style from "./Footer.less";

export default class Footer extends React.Component {
  render() {
    return (
      <div styleName="Footer">
        made by stackola |{" "}
        <a target="_blank" href="https://github.com/stackola">
          github
        </a>{" "}
        |{" "}
        <a target="_blank" href="https://twitter.com/Stackola_">
          twitter
        </a>{" "}
        |{" "}
        <a
          target="_blank"
          href="https://github.com/stackola/luabits-issues/issues"
        >
          report an issue
        </a>
      </div>
    );
  }
}
