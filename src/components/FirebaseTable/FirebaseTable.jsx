import React from "react";
import style from "./FirebaseTable.less";
import firebase from "lib/firebase";

import ReactLoading from "react-loading";
import BigButton from "../BigButton/BigButton";
export default class FirebaseTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 5,
      items: [],
      hasMore: true,
      loading: true
    };
  }

  componentDidMount() {
    //get first 25.
    this.fetchItems();
  }
  fetchItems() {
    let order = this.props.order || null;
    let where = this.props.where || null;
    let pageSize = this.props.pageSize || this.state.pageSize;
    let path = this.props.path;
    let q = firebase
      .firestore()
      .collection(path)
      .limit(pageSize);

    if (order) {
      q = q.orderBy(order[0], order[1]);
    }
    if (where) {
      q = q.where(where[0], where[1], where[2]);
    }
    if (this.state.items.length > 0) {
      q = q.startAfter(this.state.items[this.state.items.length - 1]);
    }
    q.get().then(snap => {
      let tmpItems = [];
      snap.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        tmpItems.push(doc);
      });
      this.setState(
        {
          items: [...this.state.items, ...tmpItems],
          loading: false,
          hasMore: tmpItems.length == pageSize
        },
        () => {
          //console.log(this.state);
        }
      );
    });
  }
  loadMore() {
    this.setState({ loading: true }, () => {
      this.fetchItems();
    });
  }
  render() {
    return (
      <div styleName="FirebaseTable" style={this.props.style}>
        {this.state.items.map((i, index) => {
          let data = i.data();
          data = { ...data, _id: i.id };
          return this.props.renderItem(data);
        })}
        {this.state.hasMore && !this.state.loading && (
          <BigButton onClick={() => this.loadMore()}>Load more</BigButton>
        )}
        {this.state.loading &&
          (this.props.loading ? (
            this.props.loading
          ) : (
            <div
              styleName={
                "loading " + (this.props.horizontal ? "horizontal" : "")
              }
            >
              <div>
                <ReactLoading
                  type={"spin"}
                  color={"white"}
                  height={20}
                  width={20}
                />
              </div>
            </div>
          ))}
        {!this.state.loading &&
          this.state.items.length == 0 &&
          !this.props.hideEmpty && (
            <div styleName="loading">No items found.</div>
          )}
        {!this.state.loading &&
          !this.state.hasMore &&
          this.props.showEnd &&
          this.state.items.length > 0 && (
            <div styleName="loading">End reached.</div>
          )}
      </div>
    );
  }
}
