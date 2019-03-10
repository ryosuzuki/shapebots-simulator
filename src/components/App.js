import React, { Component } from 'react'
import munkres from 'munkres-js'
import _ from 'lodash'


const socket = io.connect('http://localhost:8080/')

import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'

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
      points: [],
      targets: {},
    }

    this.width = 1000
    this.height = 800

    this.raycaster = new THREE.Raycaster()
    this.mouse2D = new THREE.Vector3(0, 10000, 0.5)
    this.radius = 1600
    this.theta = 90
    this.phi = 60
    this.onMouseDownPosition = new THREE.Vector2()
    this.onMouseDownPhi = 60
    this.onMouseDownTheta = 45
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    camera.position.set(0, 20, 20)
    camera.up.set(0,0,1)

    renderer.setClearColor('#eee')
    renderer.setSize(width, height)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enabled = true
    controls.maxDistance = 1500
    controls.minDistance = 0

    this.scene = scene
    this.camera = camera
    this.controls = controls
    this.renderer = renderer

    this.mount.appendChild(this.renderer.domElement)
    this.init()
  }

  init() {
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false)
    this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false)

    this.addGrid()
    this.addRobots()
    this.renderScene()
    this.start()
  }

  renderScene() {
    for (let id of this.state.ids) {
      // change color pin to red
      let pin = this.scene.getObjectByName(id)
      pin.material.color.setRGB(0.5, 0, 0)
    }
    let target = new THREE.Vector3(0, 10, 0)
    this.camera.lookAt(target)
    this.renderer.render(this.scene, this.camera)
  }

  addGrid() {
    let size = 100
    let divisions = 100
    let grid = new THREE.GridHelper(size, divisions)
    grid.geometry.rotateX( Math.PI / 2 )
    grid.position.z = -0.5
    this.grid = grid
    // this.pin = pin
    this.scene.add(grid)
  }

  addRobots() {
    for (let id = 0; id < 24; id++) {
      let xsign = Math.random() > 0.5 ? 1 : -1
      let ysign = Math.random() > 0.5 ? 1 : -1
      let x = Math.random() * 10 * xsign
      let y = Math.random() * 10 * ysign
      this.addRobot(id, x, y)
    }
  }

  moveRobot(id, x, y) {
    let targets = this.state.targets
    targets[id] = { x: x, y: y }
    this.setState({ targets: targets })
  }

  addRobot(id, x, y) {
    let robotGeometry = new THREE.CubeGeometry(1, 1, 1)
    let robotMaterial = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      opacity: 1,
      transparent: true
    })
    robotMaterial.color.setRGB(0.3, 0.3, 0.3)
    let robot = new THREE.Mesh(robotGeometry, robotMaterial)
    let wireGeometry = new THREE.EdgesGeometry(robotGeometry)
    let wireMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2
    })

    robot.wireMesh = new THREE.LineSegments(wireGeometry, wireMaterial)
    robot.isRobot = true
    robot.robotId = id
    robot.name = id
    robot.position.x = x
    robot.position.y = y
    robot.wireMesh.position.copy(robot.position)
    robot.updateMatrix()
    robot.overdraw = false
    // this.pin = pin
    this.scene.add(robot)
    this.scene.add(robot.wireMesh)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate.bind(this))
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  move() {
    for (let id = 0; id < 24; id++) {
      let robot = this.scene.getObjectByName(id)
      let current = { x: robot.position.x, y: robot.position.y }
      let target = this.state.targets[id]
      if (!target) continue

      let diff = { x: target.x - current.x, y: target.y - current.y }
      if (Math.abs(diff.x) < 1 && Math.abs(diff.y) < 1) continue

      robot.position.x += diff.x / 100
      robot.position.y += diff.y / 100
      robot.wireMesh.position.x += diff.x / 100
      robot.wireMesh.position.y += diff.y / 100
    }
  }

  animate() {
    this.controls.update()
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate.bind(this))
    this.move()
  }

  onMouseDown(event) {
    event.preventDefault()
    this.isMouseDown = true
    this.onMouseDownPosition.x = event.clientX
    this.onMouseDownPosition.y = event.clientY

    let intersect = this.getIntersecting()
    if (intersect) {
      this.currentObject = intersect.object
      this.controls.enabled = false

      let id = this.currentObject.name
      console.log(id)
      let ids = this.state.ids
      if (this.state.ids.includes(id)) {
        ids = _.difference(ids, [id])
      } else {
        if (this.state.single) {
          ids = [id]
        } else {
          ids = _.union(ids, [id])
        }
      }
      this.setState({ ids: ids })
      console.log(this.state.ids)
    }
  }

  onMouseMove(event) {
    event.preventDefault()
    this.mouse2D.x = (event.clientX / this.width) * 2 - 1
    this.mouse2D.y = - (event.clientY / this.height) * 2 + 1

    this.scene.children.filter((c) => c.isPin).map((c) => {
      if (this.broken.includes(c.name)) {
        c.material.color.setRGB(0.7, 0.7, 0.7)
      } else {
        let pos = c.position.y
        c.material.color.setHSL(0.1, pos * 0.2, 0.5)
        if (pos < 0) {
          c.material.color.setHSL(0.1, 1 + pos * 0.2, 0.3)
        }
      }
    })

    let intersect = this.getIntersecting()
    if (intersect) {
      if (this.isMouseDown && this.currentObject) {
        let vector = new THREE.Vector3(this.mouse2D.x, this.mouse2D.y, -1).unproject(this.camera)
        // this.currentObject.position.y = vector.z
      } else {
        intersect.object.material.color.setRGB(0.5, 0, 0)
      }

      let id = intersect.object.name
      console.log(id)
      let ids = this.state.ids
      // if (this.state.ids.includes(id)) {
      //   ids = _.difference(ids, [id])
      // } else {
        // ids = _.union(ids, [id])
      // }
      // this.setState({ ids: ids })
      console.log(this.state.ids)

    }

  }

  onMouseUp(event) {
    event.preventDefault()
    this.isMouseDown = false
    this.controls.enabled = true
    this.onMouseDownPosition.x = event.clientX - this.onMouseDownPosition.x
    this.onMouseDownPosition.y = event.clientY - this.onMouseDownPosition.y

    if (this.onMouseDownPosition.length() > 5) return
    let intersect = this.getIntersecting()
    if (intersect) {
    }
  }

  getIntersecting() {
    let intersectable = []
    this.scene.children.map((c) => { if (c.isPin) intersectable.push(c) })

    this.raycaster.setFromCamera(this.mouse2D, this.camera)
    let intersections = this.raycaster.intersectObjects( intersectable )
    if (intersections.length > 0) {
      let intersect = intersections[0]
      return intersect
    }
  }


  render() {
    return (
      <div>
        <div
          style={{ width: this.width, height: this.height }}
          ref={(mount) => { this.mount = mount }}
        />
        <div className="ui grid">
          <h1>Hello World</h1>
        </div>
      </div>
    )
  }
}

export default App