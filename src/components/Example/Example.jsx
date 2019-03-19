import React from "react";
import style from "./Example.less";
require("codemirror/mode/lua/lua");
import "codemirror/lib/codemirror.css";
import "../LuaBox/theme.less";

import CodeMirror from "react-codemirror";
export default class Example extends React.Component {
  render() {
    return (
      <div styleName={"Example " + (this.props.noPadding ? "noPadding" : "")}>
        {this.props.name && <div styleName="title">{this.props.name}</div>}
        <div styleName="rest">
          <div>{this.props.text}</div>
          <CodeMirror
            styleName={
              "code " + (this.props.extraClass ? this.props.extraClass : "")
            }
            options={{
              mode: "lua",
              theme: "oceanic-next",
              lineNumbers: true,
              readOnly: true
            }}
            value={this.props.code}
            onChange={c => {}}
          />
          <br />
          Response:
          <div styleName="response">
            {this.props.json
              ? JSON.stringify(this.props.response, null, 4)
              : this.props.response}
          </div>
          {this.props.link && (
            <a styleName="tryLink" href={this.props.link} target="_blank">
              Try it
            </a>
          )}
        </div>
      </div>
    );
  }
}
