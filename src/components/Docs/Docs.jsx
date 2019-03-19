import React from "react";
import style from "./Docs.less";
import Title from "../Title/Title";
import Example from "../Example/Example";

export default class Docs extends React.Component {
  render() {
    return (
      <div styleName="Docs">
        <div styleName="contents">
          <a href="#req" styleName="big sub">
            req
          </a>
          <a href="#req-query" styleName="">
            req.query( )
          </a>
          <a href="#req-json" styleName="">
            req.json( )
          </a>
          <a href="#db" styleName="big sub">
            db
          </a>
          <a href="#db-create" styleName="">
            db.create( )
          </a>
          <a href="#db-update" styleName="">
            db.update( )
          </a>
          <a href="#db-get" styleName="">
            db.get( )
          </a>
          <a href="#db-list" styleName="">
            db.list( )
          </a>
          <a href="#res" styleName="big sub">
            res
          </a>
          <a href="#res-send" styleName="">
            res.send( )
          </a>
          <a href="#res-json" styleName="">
            res.json( )
          </a>
          <a href="#res-ok" styleName="">
            res.ok( )
          </a>
          <a href="#res-error" styleName="">
            res.error( )
          </a>
          <a href="#res-redirect" styleName="">
            res.redirect( )
          </a>
          <a href="#utils" styleName="big sub">
            utils
          </a>
          <a href="#utils-log" styleName="">
            utils.log( )
          </a>
        </div>
        <div style={{ height: 50 }} />
        <div styleName="section">
          <a name="req" />
          <div styleName="sub big">req</div>
          <div styleName="row">
            Contains information related to the incoming HTTPS request.
          </div>
          <a name="req-query" />
          <div styleName="sub">req.query</div>
          <div styleName="row">
            The req.query variable contains an object of the URL parameters. The
            names 'uid', 'pid' and 'func' are reserved, you can add as many
            others as you like.
          </div>
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                extraClass="bigger"
                name="Example"
                noPadding
                code={
                  "number = req.query.number -- &number=...\n\nif number then\n  res.ok({result = number*2})\nelse\n  -- no number supplied\n  res.error({message = 'No number supplied'})\nend"
                }
                response={{ status: "ok", data: { result: 24 } }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=get-url-params&number=99"
              />
            </div>
          )}
        </div>
        <div styleName="section">
          <a name="req-json" />
          <div styleName="sub">req.json</div>
          <div styleName="row">
            The req.json variable holds an object of the JSON values posted to
            your function.
          </div>
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                name="Example"
                noPadding
                code={
                  "res.ok({postedJson = req.json})  -- req.json holds the json object posted to the function"
                }
                response={{
                  status: "ok",
                  data: {
                    postedJson: {
                      key: "value",
                      key2: 42
                    }
                  }
                }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=posted-json-example"
              />
            </div>
          )}
        </div>
        <Title>Functions</Title>
        <div styleName="section">
          <a name="db" />
          <div styleName="sub big">db</div>
          <a name="db-create" />
          <div styleName="sub">db.create( )</div>
          <div styleName="row">
            db.create( bucket, data, callback( newId )? )
            <br />
            <br />
            Create a new entry in the database. Make sure you have created the
            bucket in your Project settings first.
            <br />
            If no callback is supplied, a standard response is generated.
          </div>
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                extraClass="bigger"
                noPadding
                name="Example without callback"
                code={
                  "todo = req.query.todo\n\nif todo then\n  -- add to previously created bucket 'todos'\n  -- no callback supplied means a standard json response will be generated.\n  db.create('todos', {todo = todo, completed = false})\nelse\n  res.error({message = 'No todo supplied.'})\nend"
                }
                response={{
                  status: "ok",
                  data: {
                    item: {
                      todo: "Shopping",
                      completed: false,
                      id: "pE12Id3gktT93AqLrTiC",
                      time: "2019-03-19T17:05:08.805Z"
                    }
                  }
                }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=add-to-bucket&todo=Shopping"
              />
            </div>
          )}
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                extraClass="evenBigger"
                noPadding
                name="Example with callback"
                code={
                  "todo = req.query.todo\n\nif todo then\n  db.create('todos', {todo = todo, completed = false},\n  	function (newId)\n      res.json({newItemId = newId})\n    end\n  )\nelse\n  res.error({message = 'No todo supplied.'})\nend"
                }
                response={{ newItemId: "Q9019kHxmSxf8NIphsAx" }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=create-with-callback&todo=Shopping"
              />
            </div>
          )}
          <a name="db-update" />
          <div styleName="sub">db.update( )</div>
          <div styleName="row">
            db.update( bucket, itemId, newData, callback( success_bool )? )
            <br />
            <br />
            Update an entry in a bucket.
          </div>
          <br />
          <a name="db-get" />
          <div styleName="sub">db.get( )</div>
          <div styleName="row">
            db.get( bucket, itemId, callback( object|false )? )
            <br />
            <br />
            Fetch a single item from a bucket.
          </div>
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                noPadding
                extraClass="bigger"
                name="Example without callback"
                code={
                  "todoId = req.query.todoId\n\nif todoId then\n  db.get('todos',todoId)\nelse\n  res.error({message = 'No todoId given'})\nend"
                }
                response={{
                  status: "ok",
                  data: {
                    item: {
                      completed: false,
                      time: "2019-03-19T17:05:08.805Z",
                      todo: "Shopping",
                      id: "pE12Id3gktT93AqLrTiC"
                    }
                  }
                }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=get-from-bucket&todoId=pE12Id3gktT93AqLrTiC"
              />
            </div>
          )}
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                name="Example with callback"
                noPadding
                extraClass="biggest"
                code={
                  "todoId = req.query.todoId\n\nif todoId then\n  db.get('todos',todoId,\n  function (item)\n  	if (item) then\n    	res.json({item = item})\n    else\n        res.error('Item not found')\n    end\n  end\n  )\nelse\n  res.error({message = 'No todoId given'})\nend"
                }
                response={{
                  item: {
                    time: "2019-03-19T17:05:08.805Z",
                    todo: "Shopping",
                    id: "pE12Id3gktT93AqLrTiC",
                    completed: false
                  }
                }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=get-with-callback&todoId=pE12Id3gktT93AqLrTiC"
              />
            </div>
          )}
          <a name="db-list" />
          <div styleName="sub">db.list( )</div>
          <div styleName="row">
            db.list( bucket, options?, callback( response | false )? )
            <br />
            <br />
            Get a page of entries from a bucket.
            <br />
            <br />
            <b>options:</b>
            <div styleName={"indent"}>
              <b>options.pageSize</b> (int between 1 and 25, default: 10)
              <br />
              <b>options.pageToken</b> (string, previously received from the
              backend. Used for pagination)
            </div>
            <br />
            <b>Note:</b> You can only supply one of the two following options
            `order` or `where`. Not both. This would require indexing, which is
            currently not available.
            <br />
            If you use `where`, the ordering is still deterministic, but follows
            no particular pattern. Pagination using pageTokens still works as
            expected.
            <br />
            <br />
            <div styleName="indent">
              <b>options.where</b> [ field, operator, needle ]
              <br />
              Example:
              <br />
              where = {'{"completed","==", true}'}
              <br />
              Operator can be either: &lt;, &lt;=, ==, &gt;, &gt;=, or
              array_contains.
              <br />
              <br />
              <b>options.order</b> [ field, direction ]
              <br />
              Example: <br />
              order = {'{"time","desc"}'}
              <br />
            </div>
            <br />
            <b>response:</b>
            <div styleName={"indent"}>
              <b>response.items</b> array of items. <br />
              <br />
              <b>response.pageToken?</b> string. <br />
              If there are more results beyond the current page, a pageToken
              will be returned. This pageToken can be passed to the db.list
              function, to receive the next page. Make sure the `where` /
              `order` clauses are the same for each subsequent page.
            </div>
          </div>

          {this.props.showExamples && (
            <div styleName="row">
              <Example
                name="Example with callback"
                noPadding
                extraClass="bigger"
                code={
                  "-- get the 10 newest entries in the bucket.\ndb.list('todos',{pageSize = 10},\n	function (response)\n    	items = response.items -- array of items\n    	pageToken = response.pageToken -- only set if there is more data to fetch.\n    	res.json({items = items, pageToken = pageToken})\n    end\n)"
                }
                response={{
                  items: [
                    {
                      completed: false,
                      time: "2019-03-19T19:51:43.438Z",
                      todo: "Shopping",
                      id: "qwqQrhZqyJJtqacuojVv"
                    },
                    {
                      time: "2019-03-19T19:48:19.359Z",
                      todo: "test",
                      id: "Q9019kHxmSxf8NIphsAx",
                      completed: false
                    },
                    "...",
                    {
                      time: "2019-03-19T19:45:31.005Z",
                      todo: "test",
                      id: "bVcrsbB0MUX4OGLmveiB",
                      completed: false
                    }
                  ],
                  pageToken: "bVcrsbB0MUX4OGLmveiB"
                }}
                json
                link=""
              />
              <Example
                noPadding
                name="Pagination"
                code={
                  "db.list('todos',{pageSize=2}) -- default sort is 'newest first'."
                }
                text={"Getting page 1. Take note of the pageToken.\n\n"}
                response={{
                  status: "ok",
                  data: {
                    pageToken: "o2IrRQO48JfUeHO5AudW",
                    items: [
                      {
                        id: "TywaXltcmsxqwToj962d",
                        completed: false,
                        time: "2019-03-19T17:58:54.809Z",
                        todo: "Shopping"
                      },
                      {
                        completed: false,
                        time: "2019-03-19T17:29:41.604Z",
                        todo: "Shopping",
                        id: "o2IrRQO48JfUeHO5AudW"
                      }
                    ]
                  }
                }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=list-example"
              />
              <Example
                noPadding
                name="Getting the next page."
                text={
                  "Using the pageToken we received in the previous example, we can fetch the next page.\n\n"
                }
                code={
                  "db.list('todos',{pageSize=2, pageToken='o2IrRQO48JfUeHO5AudW'})"
                }
                response={{
                  status: "ok",
                  data: {
                    pageToken: "VlqBjKNGZV14oQxjfkXz",
                    items: [
                      {
                        time: "2019-03-19T17:26:28.294Z",
                        todo: "Shopping",
                        id: "fHAuDyyRsyLMokuJ64Qc",
                        completed: false
                      },
                      {
                        completed: false,
                        time: "2019-03-19T17:14:04.961Z",
                        todo: "Shopping",
                        id: "VlqBjKNGZV14oQxjfkXz"
                      }
                    ]
                  }
                }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=next-page-example"
              />
            </div>
          )}
        </div>
        <br />
        <div styleName="section">
          <a name="res" />
          <div styleName="sub big">res</div>
          <a name="res-send" />
          <div styleName="sub">res.send( )</div>
          <div styleName="row">
            res.send( string )
            <br />
            <br />
            Send a positive HTTPS response containing the supplied string.
          </div>
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                name="Example"
                noPadding
                code={"res.send('Hello World')"}
                response={"Hello World"}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=simple-send"
              />
            </div>
          )}
          <a name="res-json" />
          <div styleName="sub">res.json( )</div>
          <div styleName="row">
            res.json( data )
            <br />
            <br />
            Send a HTTP response with a JSON payload
          </div>
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                name="Example"
                noPadding
                code={"res.json({test = 'passed'})"}
                response={{ test: "passed" }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=simple-json"
              />
            </div>
          )}
          <a name="res-ok" />
          <div styleName="sub">res.ok( )</div>
          <div styleName="row">
            res.ok( data )
            <br />
            <br />
            Send an standarized JSON response via HTTPS
          </div>
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                name="Example"
                noPadding
                code={"res.ok({password = 'swordfish'})"}
                response={{ status: "ok", data: { password: "swordfish" } }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=simple-ok"
              />
            </div>
          )}
          <a name="res-error" />
          <div styleName="sub">res.error( )</div>
          <div styleName="row">
            res.error( data )
            <br />
            <br />
            Send an standarized error JSON response via HTTPS
          </div>
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                name="Example"
                noPadding
                code={
                  "res.error({errorMessage = 'Stuff went real bad, real quick!'})"
                }
                response={{
                  status: "error",
                  data: { errorMessage: "Stuff went real bad, real quick!" }
                }}
                json
                link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=simple-error"
              />
            </div>
          )}
          <a name="res-redirect" />
          <div styleName="sub">res.redirect( )</div>
          <div styleName="row">
            res.redirect( string:URL )
            <br />
            <br />
            Redirect the caller to a http(s) address.
          </div>
        </div>
        {this.props.showExamples && (
          <div styleName="row">
            <Example
              name="Example"
              noPadding
              code={"res.redirect('https://google.com')"}
              json
              link="https://luabits.com/run?uid=PFVYvJMugsVndmMtcSWj3Rlo2Tz2&pid=examples&func=simple-redirect"
            />
          </div>
        )}
        <div styleName="section">
          <a name="utils" />
          <div styleName="sub big">utils</div>
          <a name="utils-log" />
          <div styleName="sub">utils.log( )</div>
          <div styleName="row">
            utils.log( string:logEntry, callback( success_bool ) )
            <br />
            <br />
            Log an entry to the functions log. A timestamp is automatically
            added.
            <br />
            You can find each function's log right under the editor.
            <br />
          </div>
          {this.props.showExamples && (
            <div styleName="row">
              <Example
                name="Example"
                noPadding
                extraClass="bigger"
                code={
                  "utils.log('my log entry',\n    function ()\n        res.send('Logged')\n    end\n)"
                }
                response={"Logged"}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
