import React from "react";
import style from "./ForkButton.less";
import BigButton from "../BigButton/BigButton";
import { getUID, sanitize, forkFunction } from "../../lib";
import FirebaseTable from "../FirebaseTable/FirebaseTable";
import { withRouter } from "react-router";
class ForkButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      status: "start",
      name: ""
    };
  }
  save(v) {
    this.setState({ status: "loading" }, () => {
      let payload = {
        target: v,
        f: this.props.funcData,
        name: this.state.name
      };
      forkFunction(payload)
        .then(r => {
          if (r.data.status != "ok") {
            this.setState({ status: "error" });
          } else {
            //redirect!
            console.log(r);
            this.props.history.push(
              `/project/view/${r.data.newFunc.project}/editFunction/${
                r.data.newFunc.name
              }`
            );
          }
        })
        .catch(e => {
          console.log(e);
          this.setState({ status: "error" });
        });
      console.log(JSON.stringify(payload));
    });
  }
  componentDidMount() {
    this.setState({ name: this.props.name });
  }
  render() {
    let uid = getUID();
    return this.state.status == "start" ? (
      <div styleName="ForkButton">
        <BigButton
          slim
          onClick={() => {
            this.setState({ open: !this.state.open });
          }}
        >
          <div style={{ width: 8 }} />
          Fork
          <div style={{ width: 8 }} />
        </BigButton>
        {this.state.open && (
          <div styleName="inner">
            <div>Name:</div>
            <div style={{ height: 8 }} />
            <input
              onChange={e => {
                this.setState({ name: sanitize(e.target.value) });
              }}
              value={this.state.name}
            />
            <div style={{ height: 8 }} />
            Fork to:
            <div style={{ height: 8 }} />
            <FirebaseTable
              path={`users/${uid}/projects/`}
              renderItem={p => {
                return (
                  <div
                    styleName="row"
                    onClick={() => {
                      this.save(p.name);
                    }}
                  >
                    {p.name}
                  </div>
                );
              }}
            />
          </div>
        )}
      </div>
    ) : this.state.status == "error" ? (
      <div styleName="ForkButton">
        <BigButton
          slim
          onClick={() => {
            this.setState({ status: "start" });
          }}
        >
          <div style={{ width: 8 }} />
          Error. Name taken in project?
          <div style={{ width: 8 }} />
        </BigButton>
      </div>
    ) : (
      <div styleName="ForkButton">
        <BigButton slim>
          <div style={{ width: 8 }} />
          Loading
          <div style={{ width: 8 }} />
        </BigButton>
      </div>
    );
  }
}

export default withRouter(ForkButton);
