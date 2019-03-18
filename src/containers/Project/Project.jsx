import React from "react";
import style from "./Project.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import Wrapper from "../../components/Wrapper/Wrapper";
import ItemLoader from "../../components/ItemLoader/ItemLoader";
import { getUID } from "../../lib";
import { withRouter } from "react-router";
import BigButton from "../../components/BigButton/BigButton";
import Spacer from "../../components/Spacer/Spacer";
import Title from "../../components/Title/Title";
import Bucket from "../../components/Bucket/Bucket";
import FuncRow from "../../components/FuncRow/FuncRow";
import FirebaseTable from "../../components/FirebaseTable/FirebaseTable";
import Loading from "../../components/Loading/Loading";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Project extends React.Component {
  render() {
    let pid = this.props.match.params.id;
    let path = "users/" + getUID() + "/projects/" + pid;
    return (
      <ItemLoader key={pid} path={path} loading={<Loading />}>
        {projectData => {
          return (
            <Wrapper title={"Project: " + projectData.name}>
              <Title sub>Buckets:</Title>
              {projectData.buckets &&
                projectData.buckets.map(b => {
                  return (
                    <Bucket project={pid} key={b}>
                      {b}
                    </Bucket>
                  );
                })}
              <BigButton route={"/project/view/" + pid + "/createBucket"}>
                + Add a bucket
              </BigButton>
              <Spacer />
              <Title sub>Functions:</Title>
              <FirebaseTable
                hideEmpty
                pageSize={10}
                path={path + "/functions"}
                renderItem={i => {
                  return <FuncRow {...i} key={i.name} />;
                }}
              />
              <BigButton route={"/project/view/" + pid + "/createFunction"}>
                + Add a function
              </BigButton>
            </Wrapper>
          );
        }}
      </ItemLoader>
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
export default withRouter(Project);
