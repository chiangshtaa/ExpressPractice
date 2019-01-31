import React, { Component } from 'react';
const axios = require('axios');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }
  checkBack() {
    axios.get('/here')
      .then((res) => {
        console.log('results', res);
        this.setState({
          posts: res.data
        })
      })
  }
  render() {
    return (
      <div>
        REACT WORKS!!?!?
        <button onClick={() => this.checkBack()}>Click Me!</button>
        <ul>
          {this.state.posts.map((post) => {
            return (
              <li key={post.id}>
                <h4>{post.title}</h4>
                <p>{post.body}</p>
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default App;
