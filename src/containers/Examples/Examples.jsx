import React from "react";
import style from "./Examples.less";

import { connect } from "react-redux";
import { ActionCreators } from "redux/actions";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Wrapper from "../../components/Wrapper/Wrapper";
import Example from "../../components/Example/Example";

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Examples extends React.Component {
  render() {
    return (
      <Wrapper title={"Examples"}>
        <Example
          name="Hello cloud!"
          text="The simplest cloud function you could write."
          code={"res.send('Hello World!')"}
          response={"Hello World!"}
          link="https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=example-1"
        />
        <Example
          name="Returning JSON"
          text="Respond with JSON in a standarized way."
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
          name="Getting URL parameters"
          text={
            "The query parameters are available through the global variable `req.query`\nIn this case we are getting the number parameter from the url multiplying it by 2."
          }
          code={
            "number = req.query.number -- &number=...\n\nif number then\n  res.json({result = number*2})\nelse\n  -- no number supplied\n  res.error({message = 'No number supplied'})\nend"
          }
          response={{ status: "ok", data: { result: 24 } }}
          json
          link="https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=example-3&number=999"
        />
        <Example
          extraClass="bigger"
          name="Adding an object to a bucket"
          text={
            "As a prequisite, you have to create a bucket in your project. In this example, the bucket is called `todos`\nWe get the `todo` parameter from the URL and use db.create() to create a new entry.\nYou can supply a callback to db.create() but if you don't, a standard response is generated."
          }
          code={
            "todo = req.query.todo\n\nif todo then\n  -- add to previously created bucket 'todos'\n  -- no callback supplied means a standard json response will be generated.\n  db.create('todos', {todo = todo, completed = false})\nelse\n  res.error({message = 'No todo supplied.'})\nend"
          }
          response={{ status: "ok", data: { newId: "5xyGEmRu9jHNvStiXVAX" } }}
          json
          link="https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=example-4&todo=Shopping"
        />
        <Example
          extraClass="bigger"
          name="Getting an object from a bucket"
          text={
            "In this example, we are retrieving an item previously added to our bucket."
          }
          code={
            "todoId = req.query.todoId\n\nif todoId then\n  -- If you don't supply a callback, a standard response is generated\n  db.get('todos',todoId)\nelse\n  res.error({message = 'No todoId given'})\nend"
          }
          response={{
            status: "ok",
            data: {
              item: {
                time: "2019-03-18T23:53:25.900Z",
                todo: "Shopping",
                id: "KsK4ikFd7xuYWT7SIv3C",
                completed: false
              }
            }
          }}
          json
          link="https://us-central1-luabits-a4c52.cloudfunctions.net/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=example-5&todoId=KsK4ikFd7xuYWT7SIv3C"
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
export default withRouter(Examples);
