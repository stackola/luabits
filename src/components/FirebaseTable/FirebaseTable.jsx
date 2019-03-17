import React from "react";
import style from "./FirebaseTable.less";
import firebase from "lib/firebase";

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
        console.log(doc.id, " => ", doc.data());
        tmpItems.push(doc);
      });
      this.setState(
        {
          items: [...this.state.items, ...tmpItems],
          loading: false,
          hasMore: tmpItems.length == pageSize
        },
        () => {
          console.log(this.state);
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
          <div
            styleName={
              "loadMore " + (this.props.horizontal ? "horizontal" : "")
            }
            onClick={() => this.loadMore()}
          >
            Load more
          </div>
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
              <div>Loading...</div>
            </div>
          ))}
      </div>
    );
  }
}
