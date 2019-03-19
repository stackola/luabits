import React from "react";
import style from "./LinkAccountArea.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";

import firebase from "lib/firebase";
import firebase2 from "firebase";
import BigButton from "../BigButton/BigButton";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class LinkAccountArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: "start"
    };
  }

  signInWithGoogle() {
    console.log("sign in");
    var provider = new firebase2.auth.GoogleAuthProvider();
    this.setState({ status: "loading" }, () => {
      firebase
        .auth()
        .currentUser.linkWithPopup(provider)
        .then(result => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          console.log(result);
          this.setState({ status: "done" });
          // ...
        })
        .catch(error => {
          console.error(error.code);
          if (error.code == "auth/credential-already-in-use") {
            this.setState({ status: "already" });
          } else {
            this.setState({ status: "error" });
          }
          // Handle Errors here.
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
  logout() {
    this.props.userUnsubscribe(() => {
      firebase.auth().signOut();
    });
  }
  render() {
    return (
      <div styleName="LinkAccountArea">
        {this.state.status != "already" ? (
          <>
            {(this.state.status == "start" ||
              this.state.status == "loading") && (
              <div styleName="accWarn">
                You are currently using an anonymous account. To ensure you keep
                access to your functions and data, consider linking your account
                to google.
              </div>
            )}
            <BigButton
              loading={this.state.status == "loading"}
              onClick={() => {
                this.signInWithGoogle();
              }}
            >
              {this.state.status == "start" && "Link with google"}
              {this.state.status == "error" && "Something went wrong."}
              {this.state.status == "done" && "Account linked to google"}
            </BigButton>
          </>
        ) : (
          <div
            styleName="alreadyLinked"
            onClick={() => {
              this.logout();
            }}
          >
            Account already in use. Click here to log out, then log back in with
            the right account.
          </div>
        )}
      </div>
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
export default LinkAccountArea;
