import React from "react";
import style from "./EditFunction.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import Wrapper from "../../components/Wrapper/Wrapper";
import BigInput from "../../components/BigInput/BigInput";
import Spacer from "../../components/Spacer/Spacer";
import LuaBox from "../../components/LuaBox/LuaBox";
import BigButton from "../../components/BigButton/BigButton";
import ItemLoader from "../../components/ItemLoader/ItemLoader";
import { getUID, compileLua, updateFunction } from "../../lib";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { withRouter } from "react-router";
import firebase from "lib/firebase";
import Docs from "../../components/Docs/Docs";
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class EditFunction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "loading..",
      name: "loading..",
      loading: true,
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
    this.setState({ status: "compiling" }, () => {
      compileLua(this.state.code).then(r => {
        if (r.data.status && r.data.status == "ok") {
          console.log("ok");
          let byteCode = r.data.bytecode;
          console.log(JSON.stringify(byteCode));
          this.setState({ status: "saving" }, () => {
            updateFunction({
              pid: pid,
              name: this.state.name,
              source: this.state.code,
              byteCode: byteCode
            })
              .then(() => {
                this.setState({ status: "done" });
              })
              .catch(e => {
                this.setState({
                  status: "error",
                  errorText: "Error saving the script."
                });
                console.log("err", e);
              });
          });
        } else {
          this.setState({
            status: "error",
            errorText: r.data.err
          });
          console.log("err", r);
        }
      });
    });
  }
  componentDidMount() {
    this.fetch();
  }
  fetch() {
    let pid = this.props.match.params.id;
    let uid = getUID();
    let fid = this.props.match.params.fid;
    console.log("users/" + uid + "/projects/" + pid + "/functions/" + fid);
    firebase
      .firestore()
      .doc("users/" + uid + "/projects/" + pid + "/functions/" + fid)
      .get()
      .then(r => {
        console.log("got func", r.data());
        let d = r.data();
        this.setState({
          name: d.name,
          code: d.source,
          loading: false
        });
      });
  }
  render() {
    let pid = this.props.match.params.id;
    let uid = getUID();
    let fid = this.props.match.params.fid;
    if (this.state.loading) {
      return <Wrapper title={"loading..."} />;
    }
    return (
      <Wrapper title={"Edit function " + this.state.name}>
        <div>
          URL:
          <br />
          <a
            styleName="funcLink"
            target={"_blank"}
            href={
              "https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=" +
              uid +
              "&pid=" +
              pid +
              "&func=" +
              fid
            }
          >
            https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=
            {uid}&pid={pid}&func={fid}
          </a>
        </div>
        <div>
          <CopyToClipboard
            text={
              "https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=" +
              uid +
              "&pid=" +
              pid +
              "&func=" +
              fid
            }
          >
            <button styleName="clickToCopy">Click to copy</button>
          </CopyToClipboard>
        </div>
        <Spacer />
        <LuaBox
          value={this.state.code}
          onChange={s => {
            console.log("trying");
            this.updateCode(s);
          }}
        />

        <Spacer />

        <BigButton
          loading={
            this.state.status == "compiling" || this.state.status == "saving"
          }
          onClick={() => {
            this.send();
          }}
        >
          Update
        </BigButton>
        {this.state.status == "error" && (
          <div styleName="error">Error: {this.state.errorText}</div>
        )}
        {this.state.status == "done" && <div styleName="done">Saved.</div>}
        <Docs />
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
export default withRouter(EditFunction);
