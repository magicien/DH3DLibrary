/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class Camera {
	public DHVector3 position;
	public DHMatrix projMat;
	public DHMatrix viewMat;
	public DH3DObject bindObj;
	public float distance;
	public float angle;
	public DHMatrix proViewMat;
	
	public Camera(){
		
	}
	
	public void bind(DH3DObject dhObject){
		
	}
	
	public void changeCoordination(){
		
	}
	
	public void frustum(float left, float right, float bottom, float top, float nearVal, float farVal){
		
	}
	
	public WebGLFloatArray getNormalMatrix() {
		return null;
	}
	
	public WebGLFloatArray getPosition(){
		return null;
	}
	
	public WebGLFloatArray getProjectionArray(){
		return null;
	}
	
	public WebGLFloatArray getProjectionViewMatrix(){
		return null;
	}
	
	public WebGLFloatArray getViewArray(){
		return null;
	}
	
	public void identity(){
		
	}
	
	public void lookat(float eyeX, float eyeY, float eyeZ, float centerX, float centerY, float centerZ, int upX, int upY, int upZ){
		
	}
	
	public void ortho(int left,int right,int bottom,int top,int nearVal,int farVal){
		
	}
	
	public void rotate(float angle, float x, float y, float z){
		
	}
	
	public void setPosition(float x, float y, float z){
		
	}
	
	public void showCameraMatrix(){
		
	}
	
	public void translate(float x, float y, float z){
		
	}
	
	public void unbind(){
		
	}
	
	public void update(float elapsedTime){
		
	}
}
