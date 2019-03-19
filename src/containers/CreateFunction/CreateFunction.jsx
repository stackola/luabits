import React from "react";
import style from "./CreateFunction.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import Wrapper from "../../components/Wrapper/Wrapper";
import LuaBox from "../../components/LuaBox/LuaBox";
import BigInput from "../../components/BigInput/BigInput";
import Spacer from "../../components/Spacer/Spacer";
import BigButton from "../../components/BigButton/BigButton";
import { compileLua, addFunction, sanitize } from "../../lib";

import { withRouter } from "react-router";
import Docs from "../../components/Docs/Docs";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class CreateFunction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: 'res.json("Hello luabits!")',
      name: "",
      status: "start"
    };
  }
  updateCode(code) {
    this.setState({ code: code }, () => {
      console.log(this.state);
    });
  }
  send() {
    let pid = this.props.match.params.id;
    let byteCode = {
      sourceName: "@lua/9ed776b0-48fc-11e9-b866-d5df7d24f98e.lua",
      lineDefined: 0,
      lastLineDefined: 0,
      upvalueCount: 0,
      paramCount: 0,
      is_vararg: 2,
      maxStackSize: 2,
      instructions: [
        5,
        0,
        0,
        0,
        6,
        0,
        0,
        257,
        1,
        1,
        2,
        0,
        28,
        0,
        2,
        1,
        30,
        0,
        1,
        0
      ],
      constants: ["res", "json", "Hello luabits!"],
      functions: [],
      linePositions: [2, 2, 2, 2, 2],
      locals: [],
      upvalues: [],
      sourcePath: "lua/9ed776b0-48fc-11e9-b866-d5df7d24f98e.lua"
    };
    this.setState({ status: "loading" }, () => {
      addFunction({
        pid: pid,
        name: this.state.name,
        source: this.state.code,
        byteCode: byteCode
      })
        .then(resp => {
          console.log(resp);
          if (resp.data.newFunction) {
            this.props.history.push(
              "/project/view/" + pid + "/editFunction/" + resp.data.newFunction
            );
          } else {
            this.setState({ status: "error" });
          }
        })
        .catch(e => {
          this.setState({ status: "error" });
        });
    });
  }
  render() {
    return (
      <Wrapper title="Create a function" showBack>
        <BigInput
          placeholder={"function-name"}
          value={this.state.name}
          onChange={s => {
            this.setState({ name: sanitize(s) });
          }}
        />
        <Spacer />
        <BigButton
          loading={this.state.status == "loading"}
          onClick={() => {
            this.send();
          }}
        >
          Continue
        </BigButton>
        {this.state.status == "error" && (
          <>
            <Spacer />
            <div>Error creating function. Name already taken?</div>
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
export default withRouter(CreateFunction);
