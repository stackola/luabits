import React from "react";
import style from "./Home.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import Wrapper from "../../components/Wrapper/Wrapper";
import BigButton from "../../components/BigButton/BigButton";
import Spacer from "../../components/Spacer/Spacer";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Home extends React.Component {
  render() {
    return (
      <Wrapper title={"Home"}>
        <BigButton route={"/project/create"}>+ Create a new project</BigButton>
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
export default Home;
