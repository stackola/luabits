import React from "react";
import style from "./Bucket.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";

import { withRouter } from "react-router";
import Wrapper from "../../components/Wrapper/Wrapper";
import FirebaseTable from "../../components/FirebaseTable/FirebaseTable";
import { getUID } from "../../lib";
import JsonBox from "../../components/JsonBox/JsonBox";
import Spacer from "../../components/Spacer/Spacer";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Bucket extends React.Component {
  render() {
    let pid = this.props.match.params.id;
    let bucket = this.props.match.params.bucket;
    let path =
      "users/" + getUID() + "/projects/" + pid + "/buckets/main/" + bucket;
    console.log(path);
    return (
      <Wrapper title={"Bucket: " + bucket} showBack>
        <FirebaseTable
          path={path}
          pageSize={10}
          order={["time", "desc"]}
          renderItem={i => {
            return <JsonBox data={i} key={i._id} />;
          }}
        />
        <Spacer />
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
export default withRouter(Bucket);
