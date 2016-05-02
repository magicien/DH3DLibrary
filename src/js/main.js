/*global exports */
import Animator from './base/Animator'
import Bone from './base/Bone'
import Camera from './base/Camera'
import CameraAnimator from './base/CameraAnimator'
import CameraKeyFrame from './base/CameraKeyFrame'
import CameraMotion from './base/CameraMotion'
import CameraMotionBank from './base/CameraMotionBank'
import CameraMotionReader from './base/CameraMotionReader'
import CanvasField from './base/CanvasField'
import Constraint from './base/Constraint'
import DH2DObject from './base/DH2DObject'
import DH3DObject from './base/DH3DObject'
import DHAudio from './base/DHAudio'
import DHEvent from './base/DHEvent'
import FragmentShader from './base/FragmentShader'
import FrameBuffer from './base/FrameBuffer'
import IK from './base/IK'
import KeyFrame from './base/KeyFrame'
import KeyListener from './base/KeyListener'
import Light from './base/Light'
//import LightKeyFrame from './base/LightKeyFrame'
import Material from './base/Material'
import Matrix from './base/Matrix'
import MessageWindow from './base/MessageWindow'
import Model from './base/Model'
import ModelBank from './base/ModelBank'
import ModelReader from './base/ModelReader'
import Motion from './base/Motion'
import MotionBank from './base/MotionBank'
import MotionReader from './base/MotionReader'
import ObjectLoadMonitor from './base/ObjectLoadMonitor'
import Renderer from './base/Renderer'
import RenderGroup from './base/RenderGroup'
import RigidBody from './base/RigidBody'
import ShaderBank from './base/ShaderBank'
import ShadowKeyFrame from './base/ShadowKeyFrame'
import Skin from './base/Skin'
import TextureBank from './base/TextureBank'
import TextureUV from './base/TextureUV'
import Vector3 from './base/Vector3'
import Vector4 from './base/Vector4'
import VertexShader from './base/VertexShader'
import Face from './mmd/Face'
import IKFrame from './mmd/IKFrame'
import MMDAnimator from './mmd/MMDAnimator'
import MMDCameraAnimator from './mmd/MMDCameraAnimator'
import PMDModel from './mmd/PMDModel'
import PMDReader from './mmd/PMDReader'
import VMDCameraMotion from './mmd/VMDCameraMotion'
import VMDCameraReader from './mmd/VMDCameraReader'
import VMDMotion from './mmd/VMDMotion'
import VMDReader from './mmd/VMDReader'
import MtlParser from './obj/MtlParser'
import ObjMaterial from './obj/ObjMaterial'
import ObjModel from './obj/ObjModel'
import ObjParser from './obj/ObjParser'
import ObjReader from './obj/ObjReader'
import SimpleFragmentShader from './renderer/simple/SimpleFragmentShader'
import SimpleRenderer from './renderer/simple/SimpleRenderer'
import SimpleVertexShader from './renderer/simple/SimpleVertexShader'
import ToonFragmentShader from './renderer/toon/ToonFragmentShader'
import ToonRenderer from './renderer/toon/ToonRenderer'
import ToonVertexShader from './renderer/toon/ToonVertexShader'
import AjaxRequest from './util/AjaxRequest'
import BinaryParser from './util/BinaryParser'
import BinaryReader from './util/BinaryReader'
import BinaryRequest from './util/BinaryRequest'
import * as ecl from './util/ecl'
import TextReader from './util/TextReader'
import TextRequest from './util/TextRequest'
import XModel from './xfile/XModel'
import XParser from './xfile/XParser'
import XReader from './xfile/XReader'

exports.Animator = Animator
exports.Bone = Bone
exports.Camera = Camera
exports.CameraAnimator = CameraAnimator
exports.CameraKeyFrame = CameraKeyFrame
exports.CameraMotion = CameraMotion
exports.CameraMotionBank = CameraMotionBank
exports.CameraMotionReader = CameraMotionReader
exports.CanvasField = CanvasField
exports.Constraint = Constraint
exports.DH2DObject = DH2DObject
exports.DH3DObject = DH3DObject
exports.DHAudio = DHAudio
exports.DHEvent = DHEvent
exports.FragmentShader = FragmentShader
exports.FrameBuffer = FrameBuffer
exports.IK = IK
exports.KeyFrame = KeyFrame
exports.KeyListener = KeyListener
exports.Light = Light
exports.Material = Material
exports.Matrix = Matrix
exports.MessageWindow = MessageWindow
exports.Model = Model
exports.ModelBank = ModelBank
exports.ModelReader = ModelReader
exports.Motion = Motion
exports.MotionBank = MotionBank
exports.MotionReader = MotionReader
exports.ObjectLoadMonitor = ObjectLoadMonitor
exports.Renderer = Renderer
exports.RenderGroup = RenderGroup
exports.RigidBody = RigidBody
exports.ShaderBank = ShaderBank
exports.ShadowKeyFrame = ShadowKeyFrame
exports.Skin = Skin
exports.TextureBank = TextureBank
exports.TextureUV = TextureUV
exports.Vector3 = Vector3
exports.Vector4 = Vector4
exports.VertexShader = VertexShader
exports.Face = Face
exports.IKFrame = IKFrame
exports.MMDAnimator = MMDAnimator
exports.MMDCameraAnimator = MMDCameraAnimator
exports.PMDModel = PMDModel
exports.PMDReader = PMDReader
exports.VMDCameraMotion = VMDCameraMotion
exports.VMDCameraReader = VMDCameraReader
exports.VMDMotion = VMDMotion
exports.VMDReader = VMDReader
exports.MtlParser = MtlParser
exports.ObjMaterial = ObjMaterial
exports.ObjModel = ObjModel
exports.ObjParser = ObjParser
exports.ObjReader = ObjReader
exports.SimpleFragmentShader = SimpleFragmentShader
exports.SimpleRenderer = SimpleRenderer
exports.SimpleVertexShader = SimpleVertexShader
exports.ToonFragmentShader = ToonFragmentShader
exports.ToonRenderer = ToonRenderer
exports.ToonVertexShader = ToonVertexShader
exports.AjaxRequest = AjaxRequest
exports.BinaryParser = BinaryParser
exports.BinaryReader = BinaryReader
exports.BinaryRequest = BinaryRequest
exports.ecl = ecl
exports.TextReader = TextReader
exports.TextRequest = TextRequest
exports.XModel = XModel
exports.XParser = XParser
exports.XReader = XReader

if(!Array.from) {
  Array.from = function(iterable) {
    if (!iterable) return []
    if ('toArray' in Object(iterable)) return iterable.toArray()
    if (iterable.constructor && iterable.constructor.name === 'Set') {
      const arr = []
      for(const v of iterable){ 
        arr.push(v)
      }
      return arr
    }

    let length = iterable.length || 0
    const results = new Array(length)
    while (length--)
      results[length] = iterable[length]

    return results
  }
}

