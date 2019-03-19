import React from "react";
import style from "./Home.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import Wrapper from "../../components/Wrapper/Wrapper";
import BigButton from "../../components/BigButton/BigButton";
import Spacer from "../../components/Spacer/Spacer";

import ProjRow from "../../components/ProjRow/ProjRow";
import Title from "../../components/Title/Title";
import FirebaseTable from "../../components/FirebaseTable/FirebaseTable";
import Example from "../../components/Example/Example";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Home extends React.Component {
  render() {
    return (
      <Wrapper>
        <div
          style={{
            textAlign: "center",
            paddingTop: 4,
            paddingBottom: 4,
            color: "red",
            height: "auto",
            fontSize: 16,
            background: "darkred",
            color: "white"
          }}
        >
          This is a pre-pre-alpha development version. DO NOT USE unless you
          want everything to break, always.
        </div>
        <div styleName="big">
          Luabits.com lets you deploy scalable LUA 5.1 functions to the cloud in
          3 clicks.
          <br />
          <br />
          Build a backend for your codepen, your school project, your mobile
          app, or your IOT device.
        </div>
        <Example
          noPadding
          name="Hello Cloud!"
          code={'res.json({dateString = os.date("today is %A, in %B")})'}
          response={{
            status: "ok",
            data: { dateString: "today is Monday, in March" }
          }}
          json
          link="https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=example-2"
        />
        <Example
          extraClass="bigger"
          noPadding
          name="Buckets!"
          text={
            "Store objects using the latest in bucket-based nosql document storage.\n\n"
          }
          code={
            "todo = req.query.todo -- get URL query parameter\n\nif todo then\n  -- add to previously created bucket 'todos'\n  -- no callback supplied means a standard json response will be generated.\n  db.create('todos', {todo = todo, completed = false})\nelse\n  res.error({message = 'No todo supplied.'})\nend"
          }
          response={{ status: "ok", data: { newId: "5xyGEmRu9jHNvStiXVAX" } }}
          json
          link="https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=example-4&todo=Shopping"
        />
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
export default Home;
