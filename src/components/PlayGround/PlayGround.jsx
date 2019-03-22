import React from "react";
import style from "./PlayGround.less";
import Title from "../Title/Title";
import { isDev } from "../../lib";
import BigButton from "../BigButton/BigButton";
import axios from "axios";
let baseUrl = isDev()
  ? "http://localhost:5001/luabits-a4c52/us-central1/run?uid="
  : "https://luabits.com/run?uid=";
export default class PlayGround extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      extraUrl: "",
      extraJson: "",
      status: "start"
    };
  }
  validateAndFormatJson() {
    let d;
    try {
      d = JSON.parse(this.state.extraJson);
      this.setState({
        extraJson: JSON.stringify(d, null, 4)
      });
    } catch (e) {
      console.log("That aint json.");
    }
  }
  sendRequest() {
    let uid = this.props.uid;
    let pid = this.props.pid;
    let fid = this.props.fid;
    let url = baseUrl + uid + "&pid=" + pid + "&func=" + fid;
    if (this.state.extraUrl) {
      url += "&" + this.state.extraUrl;
    }

    if (this.state.extraJson) {
      let d;
      try {
        JSON.parse(this.state.extraJson);

        this.setState({ status: "loading", response: "" }, () => {
          axios
            .post(url, d)
            .then(r => {
              this.processResponse(r);
            })
            .catch(() => {
              this.setState({ status: "error" });
            });
        });
      } catch (e) {
        this.setState({ status: "invalidJson" });
        console.log("invalid json");
      }
    } else {
      this.setState({ status: "loading", response: "" }, () => {
        axios
          .get(url)
          .then(r => {
            this.processResponse(r);
          })
          .catch(() => {
            this.setState({ status: "error" });
          });
      });
    }
  }
  processResponse(r) {
    console.log("got resp from func", r);
    this.setState({ response: r.data, status: "done" });
  }
  render() {
    let uid = this.props.uid;
    let pid = this.props.pid;
    let fid = this.props.fid;
    let url = baseUrl + uid + "&pid=" + pid + "&func=" + fid;
    return (
      <div styleName="PlayGround">
        <Title>Playground</Title>
        <div style={{ height: 12 }} />
        <div>Add URL parameters:</div>
        <div style={{ height: 8 }} />
        <div styleName="inputs">
          ...{"&pid=" + pid + "&func=" + fid}&
          <input
            value={this.state.extraUrl}
            placeholder="extraParam1=..."
            onChange={e => {
              this.setState({ extraUrl: e.target.value });
            }}
          />
        </div>
        <div style={{ height: 12 }} />
        <div>Post JSON:</div>
        <div style={{ height: 8 }} />
        <textarea
          value={this.state.extraJson}
          onChange={e => {
            this.setState({ extraJson: e.target.value });
          }}
        />
        <div style={{ height: 8 }} />
        <BigButton
          loading={this.state.status == "loading"}
          onClick={() => {
            this.sendRequest();
          }}
        >
          {this.state.status == "start" && "Send request"}
          {this.state.status == "invalidJson" &&
            "Invalid JSON. Click to try again."}

          {this.state.status == "error" && "Error occured. Click to try again."}
          {this.state.status == "done" && "Done!"}
        </BigButton>
        <div style={{ height: 12 }} />
        Response:
        <div style={{ height: 8 }} />
        <div styleName="response">
          {JSON.stringify(this.state.response, null, 4)}
        </div>
      </div>
    );
  }
}
