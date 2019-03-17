import React from "react";
import style from "./BigInput.less";

export default class BigInput extends React.Component {
  componentDidMount() {
    if (this.ref) {
      this.ref.focus();
    }
  }

  render() {
    return (
      <>
        <div styleName="label">{this.props.label}</div>
        <input
          ref={ref => {
            this.ref = ref;
          }}
          placeholder={this.props.placeholder}
          readOnly={this.props.readOnly}
          styleName="BigInput"
          value={this.props.value}
          onChange={e => {
            this.props.onChange(e.target.value);
          }}
        />
      </>
    );
  }
}
