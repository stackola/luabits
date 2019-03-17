import React from "react";
import style from "./NewProject.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import Wrapper from "../../components/Wrapper/Wrapper";
import BigInput from "../../components/BigInput/BigInput";
import Spacer from "../../components/Spacer/Spacer";
import BigButton from "../../components/BigButton/BigButton";
import { newProject } from "lib/index";

import { withRouter } from "react-router";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class NewProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }

  create() {
    this.setState({ status: "loading" }, () => {
      newProject({ name: this.state.name }).then(resp => {
        console.log(resp);
        if (resp.data.status !== "ok") {
          console.log("Stuff went wrong.");

          this.setState({ status: "error" });
          return;
        }
        this.props.history.push("/project/view/" + resp.data.newProject);
      });
    });
  }
  render() {
    return (
      <Wrapper title={"Create new project"}>
        <BigInput
          label={"Project name"}
          value={this.state.name}
          onChange={t => {
            this.setState({ name: t });
          }}
        />
        <Spacer />
        <BigButton
          loading={this.state.status == "loading"}
          onClick={() => {
            this.create();
          }}
        >
          Next
        </BigButton>
        {this.state.status == "error" && (
          <>
            <Spacer />
            <div>Error creating bucket. Name already taken?</div>
          </>
        )}
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
export default withRouter(NewProject);
