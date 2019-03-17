import React from "react";
import style from "./NewProject.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import Wrapper from "../../components/Wrapper/Wrapper";
import BigInput from "../../components/BigInput/BigInput";
import Spacer from "../../components/Spacer/Spacer";
import BigButton from "../../components/BigButton/BigButton";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class NewProject extends React.Component {
  render() {
    return (
      <Wrapper title={"Create new project"}>
        <BigInput label={"Project name"} />
        <Spacer />
        <BigButton
          onClick={() => {
            console.log("clicked");
          }}
        >
          Next
        </BigButton>
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
export default NewProject;
