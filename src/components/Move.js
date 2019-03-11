
const Move = {
  moveRobot(id, x, y, angle, length) {
    if (!angle) angle = 0
    if (!length) length = 1
    for (let id = 0; id < App.max; id++) {
      let robot = App.scene.getObjectByName(id)
      robot.init = false
    }

    App.targets[id] = { x: x, y: y, angle: angle, length: length }
  },

  move() {
    for (let id = 0; id < App.max; id++) {
      let robot = App.scene.getObjectByName(id)
      let current = {
        x: robot.position.x,
        y: robot.position.y,
        angle: robot.rotation.z,
        length: robot.scale.y,
      }
      let target = App.targets[id]
      if (!target) continue

      let diff = {
        x: target.x - current.x,
        y: target.y - current.y,
        angle: target.angle - current.angle,
        length: target.length - current.length
      }
      if (!robot.init) {
        if (robot.scale.y > 1) {
          robot.scale.y -= 0.1
          robot.wireMesh.scale.y -= 0.1
          continue
        } else {
          robot.init = true
        }
      }

      if (Math.abs(diff.x) < 1 && Math.abs(diff.y) < 1 && Math.abs(diff.angle) < 0.1) {
        if (Math.abs(diff.length) > 0.1) {
          robot.scale.y += diff.length / 30
          robot.wireMesh.scale.y += diff.length / 30
        }
      }

      robot.position.x += diff.x / 100
      robot.position.y += diff.y / 100
      robot.rotation.z += diff.angle / 50
      robot.wireMesh.position.x += diff.x / 100
      robot.wireMesh.position.y += diff.y / 100
      robot.wireMesh.rotation.z += diff.angle / 50
    }
  }

}

export default Move