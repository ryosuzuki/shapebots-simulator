import React, { Component } from 'react'
import simpleIcons from 'simple-icons'

class Menu extends Component {
  constructor(props) {
    super(props)
    window.menu = this

    let icons = []
    let keys = Object.keys(simpleIcons)
    for (let key of keys) {
      let logo = simpleIcons[key]
      let icon = {
        name: logo.title,
        svg: logo.svg
      }
      icons.push(icon)
    }

    this.state = {
      icons: icons,
      icon: null
    }
  }

  componentDidMount() {
  }

  onChange(event) {
    let id = event.target.value
    let svg = this.state.icons[id].svg
    let parser = new DOMParser()
    let dom = parser.parseFromString(svg, 'text/xml')
    let d = dom.querySelector('path').getAttribute('d')
    app.pathData = d
    app.draw()
  }

  render() {
    return (
      <div id="menu">
        <h1>Menu</h1>
        <div className="ui form">
          <div className="field">
            <label>SVG</label>
            <select className="ui dropdown" onChange={this.onChange.bind(this)}>
              <option value="">Select SVG</option>
              { this.state.icons.map((icon, id) => {
                return (
                  <option key={ id } value={ id }>{icon.name}</option>
                )
              })}
            </select>
          </div>
        </div>
      </div>
    )
  }
}

export default Menu