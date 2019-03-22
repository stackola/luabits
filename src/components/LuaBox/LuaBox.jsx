import React from "react";
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";
import "./theme.less";
import "./LuaBox.less";
require("codemirror/mode/lua/lua");

export default class LuaBox extends React.Component {
  render() {
    return (
      <>
        <CodeMirror
          styleName={"LuaBox"}
          options={{
            readOnly: this.props.readOnly,
            mode: "lua",
            theme: "oceanic-next",
            lineNumbers: true
          }}
          value={this.props.value}
          onChange={c => {
            console.log("change");
            this.props.onChange(c);
          }}
        />
      </>
    );
  }
}
