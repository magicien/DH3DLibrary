/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class Light {
	public int LIGHT_TYPE_DIRECTIONAL;
	public int type;
	public DHVector3 position;
	public DHVector4 ambient;
	public DHVector4 diffuse;
	public DHVector4 specular;
	private WebGLFloatArray _positionCache;
	private WebGLFloatArray _ambientCache;
	private WebGLFloatArray _diffuseCache;
	private WebGLFloatArray _specularCache;
	
	public Light(){
		
	}
	public WebGLFloatArray getAmbient(){
		return null;
	}
	public WebGLFloatArray getDiffuse(){
		return null;
	}
	public WebGLFloatArray getPosition(){
		return null;
	}
	public WebGLFloatArray getSpecular(){
		return null;
	}
	public int getType(){
		return 0;
	}
	public void setAmbient(float r, float g, float b, float a){
		
	}
	public void setDiffuse(float r, float g, float b, float a){
		
	}
	public void setPosition(float x, float y, float z){
		
	}
	public void setSpecular(float r, float g, float b, float a){
		
	}
	public void setType(int type){
		
	}
}
