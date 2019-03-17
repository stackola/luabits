import React from "react";
import style from "./CollectionLoader.less";
import firebase from "lib/firebase";

export default class CollectionLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      loading: true
    };
  }
  componentDidMount() {
    this.get();
  }
  get() {
    let collection = this.props.collection;
    let path = this.props.path;
    firebase
      .firestore()
      .doc(path)
      .collection(collection)
      .get()
      .then(snap => {
        console.log(snap);
        this.setState(
          {
            loading: false,
            items: snap.docs.map(d => {
              return d.data();
            })
          },
          () => {
            console.log(this.state);
          }
        );
      });
  }

  render() {
    return (
      <>
        {this.state.items &&
          this.state.items.map(i => {
            return this.props.renderItem(i);
          })}
      </>
    );
  }
}
