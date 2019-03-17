import React from "react";
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";
require("codemirror/mode/lua/lua");

export default class LuaBox extends React.Component {
  render() {
    return (
      <>
        <CodeMirror
          options={{ mode: "lua" }}
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
