import React, { Component } from 'react'
import munkres from 'munkres-js'
import _ from 'lodash'

const socket = io.connect('http://localhost:8080/')

// import Robot from './Robot'
// import Point from './Point'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    this.socket = socket
    this.state = {
      robots: [],
      data: null,
      ids: [],
      corners: [],
      points: []
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <div className="ui grid">
          <h1>Hello World</h1>
        </div>
      </div>
    )
  }
}

export default App