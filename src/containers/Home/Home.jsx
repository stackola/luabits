import React from "react";
import style from "./Home.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import Wrapper from "../../components/Wrapper/Wrapper";
import BigButton from "../../components/BigButton/BigButton";
import Spacer from "../../components/Spacer/Spacer";
import CollectionLoader from "../../components/CollectionLoader/CollectionLoader";
import { getUID } from "../../lib";
import ProjRow from "../../components/ProjRow/ProjRow";
import Title from "../../components/Title/Title";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Home extends React.Component {
  render() {
    return (
      <Wrapper title={"Home"}>
        <Title>Your Projects:</Title>
        <CollectionLoader
          path={"users/" + getUID()}
          collection={"projects"}
          renderItem={i => {
            return <ProjRow {...i} />;
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
