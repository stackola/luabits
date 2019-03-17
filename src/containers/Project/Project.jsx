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
import CollectionLoader from "../../components/CollectionLoader/CollectionLoader";
import FuncRow from "../../components/FuncRow/FuncRow";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Project extends React.Component {
  render() {
    let pid = this.props.match.params.id;
    let path = "users/" + getUID() + "/projects/" + pid;
    return (
      <ItemLoader
        key={pid}
        path={path}
        loading={<Wrapper title={"Loading..."} />}
      >
        {projectData => {
          return (
            <Wrapper title={"Project: " + projectData.name}>
              <Title>Functions:</Title>
              <CollectionLoader
                path={path}
                collection={"functions"}
                renderItem={i => {
                  return <FuncRow {...i} />;
                }}
              />
              <BigButton route={"/project/view/" + pid + "/createFunction"}>
                + Add a function
              </BigButton>
              <Spacer />
              <Title>Buckets:</Title>
              {projectData.buckets &&
                projectData.buckets.map(b => {
                  return <Bucket>{b}</Bucket>;
                })}
              <BigButton route={"/project/view/" + pid + "/createBucket"}>
                + Add a bucket
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
