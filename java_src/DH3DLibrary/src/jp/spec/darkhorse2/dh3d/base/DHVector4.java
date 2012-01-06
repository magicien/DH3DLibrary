/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class DHVector4 {
	public float x;
	public float y;
	public float z;
	public float w;
	
	public DHVector4(float x, float y, float z, float w){
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
	public void createAxis(DHVector3 axis, float rotAngle){
		
	}
	public void createEuler(DHVector3 eulerAngle){
		
	}
	public void cross(DHVector4 src1, DHVector4 src2){
		
	}
	public WebGLFloatArray getWebGLFloatArray(){
		return null;
	}
	public void lerp(DHVector4 vec1, DHVector4 vec2, float lerpValue){
		
	}
	public void normalize(DHVector4 src){
		
	}
	public void setValue(float x, float y, float z, float w){
		
	}
	public void slerp(DHVector4 src1, DHVector4 src, float lerpValue){
		
	}
	public void transform(DHVector4 vec, DHMatrix matrix){
		
	}
}
