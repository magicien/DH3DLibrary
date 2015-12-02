'use strict'

/**
 * Animator basic class
 * @access public
 */
export default class Animator {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
  }

  /**
   * set object's bones position/angle at specified animation time
   * and recalc bone/ik recursively.
   * @access public
   * @param {DH3DObject} dhObject - object to set bones position/angle
   * @param {float} elapsedTime - animation time
   * @returns {void}
   */
  animate(dhObject, elapsedTime) {
    const model = dhObject.getModel()

    this.updateMotion(dhObject, elapsedTime)

    model.rootBone.updateMatrixRecursive()

    model.ikArray.forEach( (ik) => {
      ik.update()
    })
  }

  /**
   * set object's bones position/angle at specified animation time
   * @param {DH3DObject} dhObject - object to set bones position/angle
   * @param {float} elapsedTime - animation time
   * @returns {void}
   */
  updateMotion(dhObject, elapsedTime) {
  }
}

