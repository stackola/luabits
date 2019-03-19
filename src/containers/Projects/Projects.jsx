import React from "react";
import style from "./Projects.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Wrapper from "../../components/Wrapper/Wrapper";
import FirebaseTable from "../../components/FirebaseTable/FirebaseTable";
import ProjRow from "../../components/ProjRow/ProjRow";
import BigButton from "../../components/BigButton/BigButton";
import { getUID } from "../../lib";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Projects extends React.Component {
  render() {
    return (
      <Wrapper title={"Your projects"}>
        <FirebaseTable
          hideEmpty
          pageSize={5}
          path={"users/" + getUID() + "/projects"}
          renderItem={i => {
            return <ProjRow {...i} key={i.name} />;
          }}
        />

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
export default withRouter(Projects);
