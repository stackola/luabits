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
import { getUID, hasGoogle } from "../../lib";
import LinkAccountArea from "../../components/LinkAccountArea/LinkAccountArea";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Projects extends React.Component {
  render() {
    return (
      <Wrapper title={"Your projects"}>
        {!hasGoogle() && <LinkAccountArea />}
        <div style={{ height: 8 }} />
        <FirebaseTable
          pageSize={5}
          path={"users/" + getUID() + "/projects"}
          renderItem={i => {
            return <ProjRow {...i} key={i.name} />;
          }}
        />
        <div style={{ height: 4 }} />

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
