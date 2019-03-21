import React from "react";
import style from "./ViewFunction.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Wrapper from "../../components/Wrapper/Wrapper";
import { getPublicFunction } from "../../lib";
import LuaBox from "../../components/LuaBox/LuaBox";
import PlayGround from "../../components/PlayGround/PlayGround";
import BackToProject from "../../components/BackToProject/BackToProject";
import Loading from "../../components/Loading/Loading";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class ViewFunction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      func: null,
      loading: true
    };
  }
  componentDidMount() {
    let { uid, pid, fid } = this.props.match.params;
    getPublicFunction({ uid, pid, fid })
      .then(data => {
        console.log("Got public function", data);
        this.setState({ func: data.data.func, proj: data.data.proj });
      })
      .catch(e => console.log);
  }

  render() {
    let { uid, pid, fid } = this.props.match.params;
    let func = this.state.func;
    let proj = this.state.proj;
    return func ? (
      <Wrapper title={"Function " + func.name}>
        <div style={{ height: 12 }} />
        <LuaBox value={func.source} onChange={() => {}} readOnly />
        <PlayGround fid={func.name} pid={proj.id} uid={proj.user} />
      </Wrapper>
    ) : (
      <Loading />
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
export default withRouter(ViewFunction);
