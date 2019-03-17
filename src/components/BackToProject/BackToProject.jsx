import React from "react";
import style from "./BackToProject.less";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

class BackToProject extends React.Component {
  render() {
    return (
      <Link
        to={"/project/view/" + this.props.match.params.id}
        styleName="BackToProject"
      >
        &lt; back
      </Link>
    );
  }
}

export default withRouter(BackToProject);
