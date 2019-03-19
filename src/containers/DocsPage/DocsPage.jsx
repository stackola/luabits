import React from "react";
import style from "./DocsPage.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Wrapper from "../../components/Wrapper/Wrapper";
import Docs from "../../components/Docs/Docs";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class DocsPage extends React.Component {
  render() {
    return (
      <Wrapper title={"Docs"}>
        <Docs showExamples />
      </Wrapper>
    );
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
export default withRouter(DocsPage);
