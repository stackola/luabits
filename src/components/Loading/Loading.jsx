import React from "react";
import style from "./Loading.less";

import ReactLoading from "react-loading";

export default class Loading extends React.Component {
  render() {
    return (
      <div styleName="Loading">
        <ReactLoading type={"spin"} color={"white"} height={20} width={20} />
      </div>
    );
  }
}
