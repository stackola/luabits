import React, { Component } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";

import style from "./AppContainer.less";

import firebase from "lib/firebase";
import firebase2 from "firebase/app";
import "firebase/auth";

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
import { getUID } from "../../lib";
import BigButton from "../../components/BigButton/BigButton";
import Footer from "../../components/Footer/Footer";
import ViewFunction from "../ViewFunction/ViewFunction";

@withRouter
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loading: false,
      wasLoggedIn: false
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(a => {
      //console.log("THAT CHANGE!", a);
      if (a && a.uid) {
        this.setState({ loggedIn: true, wasLoggedIn: true });
        this.props.userSubscribe();
      }
      if (a == null) {
        this.setState({ loggedIn: false, loading: false });
      }
      if (a == null && this.state.wasLoggedIn == false) {
        //console.log("USER NOT LOGGED IN AT ALL!");
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
    });
  }

  signInWithGoogle() {
    //console.log("sign in");

    var provider = new firebase2.auth.GoogleAuthProvider();
    this.setState({ loading: true }, () => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          console.log(result);
          // ...
        })
        .catch(function(error) {
          console.log(error);
          // Handle Errors here.
          this.setState({ loading: false });
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }
  componentWillUnmount() {
    this.props.userUnsubscribe();
  }

  render() {
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
            <Route exact path={"/share/:uid/:pid/:fid"}>
              <ViewFunction />
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
        ) : !this.state.wasLoggedIn ? (
          <Loading />
        ) : (
          <Wrapper>
            <div style={{ height: 4 }} />
            <BigButton
              onClick={() => {
                this.signInWithGoogle();
              }}
            >
              Log in with google
            </BigButton>
          </Wrapper>
        )}
        <Footer />
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
