import React from "react";
import style from "./Docs.less";
import Title from "../Title/Title";

export default class Docs extends React.Component {
  render() {
    return (
      <div styleName="Docs">
        <div styleName="section">
          <div styleName="sub">query</div>
          <div styleName="row">
            The query variable holds the URL parameters. The names 'uid', 'pid'
            and 'func' are reserved, you can add as many others as you like.
          </div>
        </div>
        <div styleName="section">
          <div styleName="sub">json</div>
          <div styleName="row">
            The json variable holds the JSON values posted to your function.
          </div>
        </div>
        <div styleName="section">
          <div styleName="sub">db</div>
          <div styleName="row">
            db.create( bucket, data, callback( newId )? )
          </div>
          <div styleName="row">
            db.update( bucket, id, data, callback( success_bool )? )
          </div>
          <div styleName="row">
            db.get( bucket, id, callback( object|false )? )
          </div>
          <div styleName="row">
            db.list( bucket, callback( [object]|false )? )
          </div>
          <div styleName="row">
            db.findAll( bucket, needle_key, operator, neeld_value, callback(
            [object]|false )? )
          </div>
          <div styleName="row">
            operator can be either &lt;, &lt;=, ==, &gt;, &gt;=, or
            array_contains
          </div>
        </div>

        <div styleName="section">
          <div styleName="sub">response</div>
          <div styleName="row">response.send( data )</div>
          <div styleName="row">response.error( data )</div>
        </div>

        <div styleName="section">
          <div styleName="sub">utils</div>
          <div styleName="row">*utils.log( data )</div>
        </div>
      </div>
    );
  }
}
