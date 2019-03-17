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
            <Route exact path={"/project/create"}>
              <NewProject />
            </Route>
          </Switch>
        ) : (
          "loading..."
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
