import React from "react";
import style from "./LogViewer.less";
import FirebaseTable from "../FirebaseTable/FirebaseTable";
import LogEntry from "../LogEntry/LogEntry";
import BigButton from "../BigButton/BigButton";

export default class LogViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  render() {
    let path =
      "users/" +
      this.props.uid +
      "/projects/" +
      this.props.pid +
      "/functions/" +
      this.props.fid +
      "/logs";
    //console.log(path);
    return (
      <div styleName="LogViewer">
        {!this.state.open && (
          <>
            <BigButton
              onClick={() => {
                this.setState({ open: true });
              }}
            >
              View logs
            </BigButton>
          </>
        )}
        {this.state.open && (
          <FirebaseTable
            showEnd
            path={path}
            pageSize={7}
            order={["time", "desc"]}
            renderItem={i => {
              return <LogEntry {...i} key={i._id} />;
            }}
          />
        )}
      </div>
    );
  }
}
