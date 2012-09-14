/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class DHVector3 {
	public float x;
	public float y;
	public float z;
	
	public DHVector3(float x, float y, float z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	public void add(DHVector3 vec1, DHVector3 vec2){
		
	}
	public void cross(DHVector3 vec1, DHVector3 vec2){
		
	}
	public float dot(DHVector3 vec){
		return 0.0f;
	}
	public WebGLFloatArray getWebGLFloatArray(){
		return null;
	}
	public float length(){
		return 0.0f;
	}
	public void lerp(DHVector3 vec1, DHVector3 vec2, float lerpValue){
		
	}
	public void mul(DHVector3 vec1, float rate){
		
	}
	public void mulAdd(DHVector3 vec1, DHVector3 vec2, float rate){
		
	}
	public void normalize(DHVector3 src){
		
	}
	public void quaternionToEuler(DHVector3 quat){
		
	}
	public void rotate(DHVector3 vec, DHMatrix matrix){
		
	}
	public void setValue(float x, float y, float z){
		
	}
	public void sub(DHVector3 vec1, DHVector3 vec2){
		
	}
	public void transform(DHVector3 vec, DHMatrix matrix){
		
	}
}
