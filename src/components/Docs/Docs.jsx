import React from "react";
import style from "./Docs.less";
import Title from "../Title/Title";

export default class Docs extends React.Component {
  render() {
    return (
      <div styleName="Docs">
        <Title>Global variables</Title>
        <div styleName="section">
          <div styleName="sub big">req</div>
          <div styleName="sub">req.query</div>
          <div styleName="row">
            The req.query variable contains an object of the URL parameters. The
            names 'uid', 'pid' and 'func' are reserved, you can add as many
            others as you like.
          </div>
        </div>
        <div styleName="section">
          <div styleName="sub">req.json</div>
          <div styleName="row">
            The req.json variable holds an object of the JSON values posted to
            your function.
          </div>
        </div>
        <Title>Functions</Title>
        <div styleName="section">
          <div styleName="sub big">db</div>
          <div styleName="sub">db.create</div>
          <div styleName="row">
            db.create( bucket, data, callback( newId )? )<br />
            Create a new entry in the database. Make sure you have created the
            bucket in your Project settings first.
          </div>
          <br />
          <div styleName="sub">db.update</div>
          <div styleName="row">
            db.update( bucket, id, data, callback( success_bool )? )
            <br />
            Update an entry in the database.
          </div>
          <br />
          <div styleName="sub">db.get</div>
          <div styleName="row">
            db.get( bucket, id, callback( object|false )? ) <br />
            Fetch a single item from the database.
          </div>
          <br />
          <div styleName="sub">db.list</div>
          <div styleName="row">
            db.list( bucket, callback( [object]|false )? ) <br />
            Fetch ALL items from the database
          </div>
          <br />
          <div styleName="sub">db.findAll</div>
          <div styleName="row">
            db.findAll( bucket, needle_key, operator, neeld_value, callback(
            [object]|false )? ) <br />
            Find ALL items in a bucket that match your search.
            <br />
            Example:
            <br />
            db.findAll( "movies", "genre", "==", "Action" )
          </div>
          <div styleName="row">
            operator can be either &lt;, &lt;=, ==, &gt;, &gt;=, or
            array_contains
          </div>
        </div>
        <br />
        <div styleName="section">
          <div styleName="sub big">res</div>
          <div styleName="sub">res.send</div>
          <div styleName="row">
            res.send( string )<br />
            Send a positive HTTPS response containing the supplied string.
          </div>
          <br />
          <div styleName="sub">res.json</div>
          <div styleName="row">
            res.json( data )<br />
            Send a positive HTTPS response with a JSON payload
          </div>
          <br />
          <div styleName="sub">res.error</div>
          <div styleName="row">
            res.error( data )<br />
            Send an error response via HTTPS
          </div>
          <br />
          <div styleName="sub">res.redirect</div>
          <div styleName="row">
            res.redirect( string:URL )<br />
            Redirect the caller to a http(s) address.
          </div>
        </div>
        <br />
        <div styleName="section">
          <div styleName="sub big">utils</div>
          <div styleName="sub">utils.log</div>
          <div styleName="row">
            utils.log( string:logEntry, callback( success_bool )? )<br />
            Log an entry to the functions log.
          </div>
        </div>
      </div>
    );
  }
}
