/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class Material {
	public DHVector4 ambient;
	public DHVector4 diffuse;
	public DHVector4 specular;
	public float shininess;
	public int toonIndex;
	public int edge;
	public String textureFileName;
	public WebGLTexture texture;
	private WebGLFloatArray _ambientCache;
	private WebGLFloatArray _diffuseCache;
	private WebGLFloatArray _specularCache;
	
	public Material(){
		
	}
	public WebGLFloatArray getAmbient(){
		return null;
	}
	public WebGLFloatArray getDiffuse(){
		return null;
	}
	public DHVector4 getShininess(){
		return null;
	}
	public WebGLFloatArray getSpecular(){
		return null;
	}
}
