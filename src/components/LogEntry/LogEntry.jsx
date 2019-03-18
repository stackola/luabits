import React from "react";
import style from "./LogEntry.less";
import { format } from "date-fns";

export default class LogEntry extends React.Component {
  render() {
    return (
      <div styleName="LogEntry">
        <div styleName="time">
          {format(this.props.time.toDate(), "YYYY/MM/DD HH:mm:ss")}
        </div>
        <div styleName="text">{this.props.message}</div>
      </div>
    );
  }
}
