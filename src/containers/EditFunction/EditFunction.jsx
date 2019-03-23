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
import {
  getUID,
  compileLua,
  updateFunction,
  hasGoogle,
  isDev
} from "../../lib";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Link } from "react-router-dom";

import { withRouter } from "react-router";
import firebase from "lib/firebase";
import Docs from "../../components/Docs/Docs";
import Title from "../../components/Title/Title";
import LogViewer from "../../components/LogViewer/LogViewer";
import Loading from "../../components/Loading/Loading";
import LinkAccountArea from "../../components/LinkAccountArea/LinkAccountArea";
import PlayGround from "../../components/PlayGround/PlayGround";
import AnimateHeight from "react-animate-height";
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
      //console.log(this.state);
    });
  }
  send() {
    let pid = this.props.match.params.id;
    this.setState({ status: "compiling" }, () => {
      compileLua(this.state.code).then(r => {
        if (r.data.status && r.data.status == "ok") {
          //console.log("ok");
          let byteCode = r.data.bytecode;
          //console.log(JSON.stringify(byteCode));
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
    //console.log("users/" + uid + "/projects/" + pid + "/functions/" + fid);
    firebase
      .firestore()
      .doc("users/" + uid + "/projects/" + pid + "/functions/" + fid)
      .get()
      .then(r => {
        //console.log("got func", r.data());
        let d = r.data();
        this.setState({
          name: d.name,
          code: d.source,
          loading: false,
          showPlay: false
        });
      });
  }
  render() {
    let pid = this.props.match.params.id;
    let uid = getUID();
    let fid = this.props.match.params.fid;
    let baseUrl = isDev()
      ? "http://localhost:5001/luabits-a4c52/us-central1/run?uid="
      : "https://luabits.com/run?uid=";
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Wrapper title={<div>Edit function: {this.state.name}</div>} showBack>
        {!hasGoogle() && <LinkAccountArea />}
        <div style={{ height: 8 }} />
        <LuaBox
          value={this.state.code}
          onChange={s => {
            console.log("trying");
            this.updateCode(s);
          }}
        />
        <div style={{ height: 8 }} />
        <BigButton
          cta
          loading={
            this.state.status == "compiling" || this.state.status == "saving"
          }
          onClick={() => {
            this.send();
          }}
        >
          Update {this.state.status == "done" && "saved"}
        </BigButton>
        {this.state.status == "error" && (
          <div styleName="error">Error: {this.state.errorText}</div>
        )}

        <div style={{ height: 8 }} />
        <div style={{ display: "flex", alignItems: "center" }}>
          <CopyToClipboard
            text={baseUrl + uid + "&pid=" + pid + "&func=" + fid}
          >
            <BigButton inline>
              <div style={{ width: 8 }} />
              Click to copy
              <div style={{ width: 8 }} />
            </BigButton>
          </CopyToClipboard>
          <div style={{ width: 8 }} />
          <a
            styleName="funcLink"
            target={"_blank"}
            href={baseUrl + uid + "&pid=" + pid + "&func=" + fid}
          >
            {baseUrl}
            {uid}&pid={pid}&func={fid}
          </a>
        </div>
        <div />
        <div style={{ height: 8 }} />
        <LogViewer {...{ pid, uid, fid }} />
        <div style={{ height: 8 }} />
        <BigButton
          onClick={() => {
            this.setState({ showPlay: !this.state.showPlay });
          }}
        >
          {this.state.showPlay ? "Hide" : "Show"} playground
        </BigButton>
        <div style={{ height: 8 }} />
        <AnimateHeight height={this.state.showPlay ? "auto" : 0}>
          <PlayGround {...{ pid, uid, fid }} />
        </AnimateHeight>

        <Title>Available APIs:</Title>
        <div style={{ height: 8 }} />
        <Link to="/docs" styleName="docsLink">
          View full docs
        </Link>
        <div style={{ height: 24 }} />
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
