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
            paddingTop: 8,
            paddingBottom: 8,
            color: "red",
            height: "auto",
            fontSize: 16,
            fontWeight: "bold",
            background: "#690000",
            color: "white"
          }}
        >
          This is a pre-pre-alpha development version. APIs can change without
          notice, and your data may not persist beyond alpha.
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
          code={'res.ok({dateString = os.date("today is %A, in %B")})'}
          response={{
            status: "ok",
            data: { dateString: "today is Monday, in March" }
          }}
          json
          link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=json-example"
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
          response={{
            status: "ok",
            data: {
              item: {
                completed: false,
                id: "pE12Id3gktT93AqLrTiC",
                time: "2019-03-19T17:05:08.805Z",
                todo: "Shopping"
              }
            }
          }}
          json
          link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=add-to-bucket&todo=Shopping"
        />
        <Example
          extraClass="bigger"
          name="Getting an item from a bucket"
          noPadding
          text={
            "In this example, we are retrieving an item previously added to our bucket.\n\n"
          }
          code={
            "todoId = req.query.todoId\n\nif todoId then\n  -- If you don't supply a callback, a standard response is generated\n  db.get('todos',todoId)\nelse\n  res.error({message = 'No todoId given'})\nend"
          }
          response={{
            status: "ok",
            data: {
              item: {
                completed: false,
                id: "pE12Id3gktT93AqLrTiC",
                time: "2019-03-19T17:05:08.805Z",
                todo: "Shopping"
              }
            }
          }}
          json
          link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=get-from-bucket&todoId=pE12Id3gktT93AqLrTiC"
        />
        <BigButton route={"/examples"}>View more examples</BigButton>
        <div style={{ height: 12 }} />
        <BigButton route={"/project/create"}>Get started</BigButton>
        <div style={{ height: 40 }} />
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
