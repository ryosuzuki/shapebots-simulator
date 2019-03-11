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
      icon: null,
      type: 'horizontal'
    }
  }

  componentDidMount() {
  }

  onChangeSvg(event) {
    let id = event.target.value
    let svg = this.state.icons[id].svg
    let parser = new DOMParser()
    let dom = parser.parseFromString(svg, 'text/xml')
    let d = dom.querySelector('path').getAttribute('d')
    app.pathData = d
    app.draw()
  }

  onChangeType(event) {
    let type = event.target.value
    this.setState({ type: type })
    app.type = type
    app.draw()
  }

  onChangeNumber(event) {
    console.log(event.target.value)
    let max = event.target.value
    app.resetRobots(max)
  }

  render() {
    return (
      <div id="menu">
        <h1>Menu</h1>
        <div className="ui form">
          <div className="field">
            <label>Robot Type</label>
            <div className="field">
              <div className="ui radio checkbox">
                <input type="radio" value="horizontal" checked={ this.state.type === 'horizontal' } onChange={ this.onChangeType.bind(this) } />
                <label>ShapeBots</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input type="radio" value="none" checked={ this.state.type === 'none' } onChange={ this.onChangeType.bind(this) }/>
                <label>Swarm Robots</label>
              </div>
            </div>
          </div>
          <div className="field">
            <label>Number of Robots</label>
            <select className="ui dropdown" onChange={this.onChangeNumber.bind(this)}>
              <option value="">{ app.max }</option>
              { [...Array(20).keys()].map(i => (i + 1) * 10).map((num, id) => {
                return (
                  <option key={ id } value={ num }>{num}</option>
                )
              })}
            </select>
          </div>
          <div className="field">
            <label>SVG</label>
            <select className="ui dropdown" onChange={this.onChangeSvg.bind(this)}>
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