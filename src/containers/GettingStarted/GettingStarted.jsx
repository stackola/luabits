import React from "react";
import style from "./GettingStarted.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Wrapper from "../../components/Wrapper/Wrapper";
import BigButton from "../../components/BigButton/BigButton";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class GettingStarted extends React.Component {
  render() {
    return (
      <Wrapper title={"Getting started"}>
        <div style={{ height: 8 }} />
        <div styleName="mid">
          Luabits lets you deploy web-scale Lua functions to the cloud in 3
          clicks.
          <br />
          How's that for buzzwords.
        </div>

        <br />
        <div styleName="big">Functions</div>
        <div styleName="mid">
          Write and deploy Lua functions, straight to the cloud.
          <br />
          Your functions can be called via https, and usually return JSON.
          <br />
          Functions have access to your buckets, along with a list of other
          utilities, like logging and controlling the HTTPS response.
        </div>
        <br />
        <div styleName="big">Buckets</div>
        <div styleName="mid">
          Buckets hold your data. The latest in bucket based no-sql datastorage
          allows you to create, read, update, delete or list JSON objects.
          <br />
          Put stuff in, take stuff out. Buckets.
          <br />
          Create one or multiple buckets in your project's settings.
          <br />
          You can click on a bucket to inspect it's contents.
          <br />
          Buckets are identiefied by their name, which has to be unique within a
          project's scope.
        </div>
        <br />

        <div styleName="big">Getting started is simple.</div>
        <div styleName="listItem">1. Create a project.</div>
        <div styleName="listItem">
          2. Create 0 or more buckets, depending on your needs.
        </div>
        <div styleName="listItem">3. Write and deploy your Lua function</div>
        <br />
        <div styleName="small">
          Note: Project / bucket / function names can only contain lower case
          letters and '-'
        </div>
        <div style={{ height: 24 }} />
        <BigButton big route={"/project/create"}>
          Create your first project!
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
export default withRouter(GettingStarted);
