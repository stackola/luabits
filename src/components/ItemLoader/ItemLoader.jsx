import React from "react";
import style from "./ItemLoader.less";
import firebase from "lib/firebase";

export default class ItemLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: null,
      loading: true
    };
  }
  getOnce() {
    let path = this.props.path;
    firebase
      .firestore()
      .doc(path)
      .get()
      .then(i => {
        this.setState(
          { loading: false, item: { ...i.data(), _id: i.id } },
          () => {}
        );
      });
  }
  sub() {
    let path = this.props.path;
    this.unsub = firebase
      .firestore()
      .doc(path)
      .onSnapshot(i => {
        this.setState(
          { loading: false, item: { ...i.data(), _id: i.id } },
          () => {}
        );
      });
  }

  componentDidMount() {
    if (this.props.realtime) {
      this.sub();
    } else {
      this.getOnce();
    }
  }
  componentWillUnmount() {
    //unsub.
    this.unsub && this.unsub();
  }
  render() {
    if (!this.state.loading) {
      return this.props.children(this.state.item);
    } else {
      return this.props.loading || <div>Loading!!</div>;
    }
  }
}
