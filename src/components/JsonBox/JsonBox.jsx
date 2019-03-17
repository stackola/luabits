import React from "react";
import style from "./JsonBox.less";
import AnimateHeight from "react-animate-height";
export default class JsonBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  render() {
    let data = this.props.data;
    if (data.time && data.time.toDate) {
      data = { ...data, time: data.time.toDate() };
    }
    return (
      <div
        styleName="JsonBox"
        onClick={() => {
          this.setState({ open: !this.state.open });
        }}
      >
        <AnimateHeight
          duration={500}
          height={this.state.open ? "auto" : 40} // see props documentation bellow
        >
          {JSON.stringify(data, null, 4)}
          <div style={{ height: 8 }} />
        </AnimateHeight>
      </div>
    );
  }
}
