'use strict'

/**
 * Face class
 * @access public
 */
export default class Face {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this.name = ''
    this.englishName = ''
    this.numVertices = 0
    this.type = 0
    this.vertices = []
  }

  setFace(pmdModel) {
    const skins = pmdModel.dynamicSkinArray

    for(let i=0; i<this.vertices.length; i++){
      skins[this.vertices[i].index].position.setValue(this.vertices[i].position)
    }
  }

  blendFace(pmdModel, rate) {
    const skins = pmdModel.dynamicSkinArray

    for(let i=0; i<this.vertices.length; i++){
      const skinPos = skins[this.vertices[i].index].position
      skinPos.mulAdd(skinPos, this.vertices[i].position, rate)
    }
  }
}

