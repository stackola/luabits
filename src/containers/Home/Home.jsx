import React from "react";
import style from "./Home.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import Wrapper from "../../components/Wrapper/Wrapper";
import BigButton from "../../components/BigButton/BigButton";
import Spacer from "../../components/Spacer/Spacer";
import { getUID } from "../../lib";
import ProjRow from "../../components/ProjRow/ProjRow";
import Title from "../../components/Title/Title";
import FirebaseTable from "../../components/FirebaseTable/FirebaseTable";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Home extends React.Component {
  render() {
    return (
      <Wrapper>
        <div styleName="big">
          This is a pre-pre-alpha development version. DO NOT USE unless you
          want everything to break, always.
        </div>
        <div styleName="big">
          Luabits.com lets you deploy scalable LUA functions to the cloud in 3
          clicks.
        </div>

        <Title sub>Your Projects:</Title>
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
export default Home;
