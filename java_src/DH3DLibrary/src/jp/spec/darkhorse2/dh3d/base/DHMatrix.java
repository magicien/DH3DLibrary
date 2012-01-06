/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class DHMatrix {
	public float m11;
	public float m12;
	public float m13;
	public float m14;
	public float m21;
	public float m22;
	public float m23;
	public float m24;
	public float m31;
	public float m32;
	public float m33;
	public float m34;
	public float m41;
	public float m42;
	public float m43;
	public float m44;
	
	public DHMatrix(DHMatrix matrix){
		
	}
	public void copyMatrix(DHMatrix src){
		
	}
	public DHMatrix[] getArray(){
		return null;
	}
	public WebGLFloatArray getWebGLFloatArray(){
		return null;
	}
	public WebGLFloatArray getWebGLFloatArrayTransposed(){
		return null;
	}
	public void identity(){
		
	}
	public void inverseMatrix(DHMatrix src){
		
	}
	public void lerp(DHMatrix src1, DHMatrix src2, float lerpValue){
		
	}
	public void matrixFromQuaternion(DHVector4 quat){
		
	}
	public void multiplyMatrix(DHMatrix src1, DHMatrix src2){
		
	}
	public void rotate(DHMatrix mat, float angle, float x, float y, float z){
		
	}
	public void showMatrix(){
		
	}
	public void translate(DHMatrix mat, float x, float y, float z){
		
	}
	public void transposeMatrix(DHMatrix src){
		
	}
}
