import React from "react";
import style from "./Examples.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Wrapper from "../../components/Wrapper/Wrapper";
import Example from "../../components/Example/Example";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Examples extends React.Component {
  render() {
    return (
      <Wrapper title={"Examples"}>
        <Example
          text="The simplest cloud function you could write."
          code={"res.json('Hello World!')"}
          response={{ status: "ok", data: "Hello World!" }}
          name="Basic cloud function"
          link="https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=10fIQQ4a6sblWn0OEHaYrNd2V2x1&pid=es&func=sd"
        />
        <Example name="Getting data from the URL" text="" />
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
export default withRouter(Examples);
