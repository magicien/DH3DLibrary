/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class DH3DObject {
	private Model _model;
	private Motion _motion;
	private Renderer _renderer;
	private Animator _animator;
	private DHEvent _eventArray;
	private float _animationTime;
	private boolean _animating;
	private boolean _loop;
	private DHVector3 _force;
	private DHVector3 _speed;
	private DHVector3 _position;
	private int _direction;
	private String _state;
	private float _motionBlendCount;
	private float _motionBlendStep;
	private float _motionStep;
	private float _motionCount;
	
	public DH3DObject(){
		
	}
	public void animate(float elapsedTime){
		
	}
	public float getAnimationTime(){
		return 0.0f;
	}
	public Skin[] getDynamicSkinArray(){
		return null;
	}
	public WebGLFloatArray getDynamicVertexData(){
		return null;
	}
	public int getNumElements(){
		return 0;
	}
	public Skin[] getSkinArray(){
		return null;
	}
	public void getTexture(){
		
	}
	public WebGLFloatArray getVertexData(){
		return null;
	}
	public void move(float elapsedTime){
		
	}
	public void render(){
		
	}
	public void setAnimationTime(float time){
		
	}
	public void setAnimator(Animator animator){
		
	}
	public void setModel(Model model){
		
	}
	public void setMotion(Motion motion){
		
	}
	public void setMotionWithBlending(Motion motion, float blendCount){
		
	}
	public void setPosition(float x, float y, float z){
		
	}
	public void setRenderer(Renderer renderer){
		
	}
	public void setRotate(float x, float y, float z, float w){
		
	}
	public void setSpeed(float x, float y, float z){
		
	}
}
