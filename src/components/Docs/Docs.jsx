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
            Create a new entry in the database. Make sure you have created the
            bucket in your Project settings first.
            <br />
            db.create( bucket, data, callback( newId )? )
          </div>
          <br />
          <div styleName="sub">db.update</div>
          <div styleName="row">
            Update an entry in the database.
            <br />
            db.update( bucket, id, data, callback( success_bool )? )
          </div>
          <br />
          <div styleName="sub">db.get</div>
          <div styleName="row">
            Fetch a single item from the database.
            <br />
            db.get( bucket, id, callback( object|false )? )
          </div>
          <br />
          <div styleName="sub">db.list</div>
          <div styleName="row">
            Get a page of entries from the database.
            <br />
            db.list( bucket, options?, callback( response | false )? )
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
        </div>
        <br />
        <div styleName="section">
          <div styleName="sub big">res</div>
          <div styleName="sub">res.send</div>
          <div styleName="row">
            Send a positive HTTPS response containing the supplied string.
            <br />
            res.send( string )
          </div>
          <br />
          <div styleName="sub">res.json</div>
          <div styleName="row">
            Send a positive HTTPS response with a JSON payload
            <br />
            res.json( data )
          </div>
          <br />
          <div styleName="sub">res.error</div>
          <div styleName="row">
            Send an error response via HTTPS
            <br />
            res.error( data )
          </div>
          <br />
          <div styleName="sub">res.redirect</div>
          <div styleName="row">
            Redirect the caller to a http(s) address.
            <br />
            res.redirect( string:URL )
          </div>
        </div>
        <br />
        <div styleName="section">
          <div styleName="sub big">utils</div>
          <div styleName="sub">utils.log</div>
          <div styleName="row">
            Log an entry to the functions log.
            <br />
            utils.log( string:logEntry, callback( success_bool )? )
          </div>
        </div>
      </div>
    );
  }
}
