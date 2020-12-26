import React, { Component } from 'react';
import './App.css';
import firebase from './firebase';
import { GiPieSlice } from 'react-icons/gi';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('items');

    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
        });
      }
      this.setState({
        items: newState,
      });
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.username,
    };
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: '',
    });
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }

  render() {
    return (
      <div className="App">
        <header>
          <GiPieSlice size={75} />
          <h1>Fun Food Friends</h1>
        </header>

        <div className="container">
          <section className="food-form">
            <form onSubmit={this.handleSubmit}>
              <label htmlFor='username'>Name</label>
              <input
                type="text"
                name="username"
                id='username'
                placeholder="what is your name?"
                onChange={this.handleChange}
                value={this.state.username}
              />
              <label htmlFor='item'>Item</label>
              <input
                type="text"
                name="currentItem"
                id='item'
                placeholder="what are you bringing?"
                onChange={this.handleChange}
                value={this.state.currentItem}
              />
              <button>Add item</button>
            </form>
          </section>

          <section className="food-items">
              <ul>
                {this.state.items.map((item) => {
                  return (
                    <li key={item.id}>
                      <h3>{item.title.toUpperCase()}</h3>
                      <p>Brought by: {item.user}</p>
                      <button onClick={() => this.removeItem(item.id)}>
                        Remove item
                      </button>
                    </li>
                  );
                })}
              </ul>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
