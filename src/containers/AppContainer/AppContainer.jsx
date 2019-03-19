import React, { Component } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";

import style from "./AppContainer.less";

import firebase from "lib/firebase";
import firebase2 from "firebase";

import { Route, Link, withRouter, Switch, Redirect } from "react-router-dom";
import Header from "../../components/Header/Header";
import Home from "../Home/Home";
import NewProject from "../NewProject/NewProject";
import Project from "../Project/Project";
import Wrapper from "../../components/Wrapper/Wrapper";
import CreateBucket from "../CreateBucket/CreateBucket";
import CreateFunction from "../CreateFunction/CreateFunction";
import EditFunction from "../EditFunction/EditFunction";
import Bucket from "../Bucket/Bucket";
import GettingStarted from "../GettingStarted/GettingStarted";
import Pricing from "../Pricing/Pricing";
import DocsPage from "../DocsPage/DocsPage";
import Examples from "../Examples/Examples";
import Loading from "../../components/Loading/Loading";
import Projects from "../Projects/Projects";

@withRouter
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(a => {
      console.log("THAT CHANGE!", a);
      if (a.uid) {
        this.setState({ loggedIn: true });
        this.props.userSubscribe();
      }
    });
    firebase
      .auth()
      .setPersistence(firebase2.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase
          .auth()
          .signInAnonymously()
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
      });
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    console.log(this.props);
    return (
      <div styleName={"main"}>
        <Header />
        {this.state.loggedIn ? (
          <Switch>
            <Route exact path={"/"}>
              <Home />
            </Route>
            <Route exact path={"/getting-started"}>
              <GettingStarted />
            </Route>
            <Route exact path={"/pricing"}>
              <Pricing />
            </Route>
            <Route exact path={"/docs"}>
              <DocsPage />
            </Route>
            <Route exact path={"/examples"}>
              <Examples />
            </Route>
            <Route exact path={"/projects"}>
              <Projects />
            </Route>
            <Route exact path={"/project/view/:id"}>
              <Project />
            </Route>
            <Route exact path={"/project/view/:id/createBucket"}>
              <CreateBucket />
            </Route>
            <Route exact path={"/project/view/:id/createFunction"}>
              <CreateFunction />
            </Route>
            <Route exact path={"/project/view/:id/editFunction/:fid"}>
              <EditFunction />
            </Route>
            <Route exact path={"/project/view/:id/bucket/:bucket"}>
              <Bucket />
            </Route>
            <Route exact path={"/project/create"}>
              <NewProject />
            </Route>
          </Switch>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default AppContainer;
