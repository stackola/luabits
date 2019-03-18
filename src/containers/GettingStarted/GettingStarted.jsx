import React from "react";
import style from "./GettingStarted.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Wrapper from "../../components/Wrapper/Wrapper";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class GettingStarted extends React.Component {
  render() {
    return <Wrapper title={"Getting started"} />;
  }
}

//Make state available as props
function mapStateToProps(state) {
  return {};
}

//Make actions available as functions in props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect to navigation, redux and export
export default withRouter(GettingStarted);
