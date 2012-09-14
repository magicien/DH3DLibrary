/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class RenderGroup {
	public Material material;
	public Bone[] boneArray;
	public int[] indices;
	public WebGLBuffer indexBuffer;
	private int _indexDataCache;
	
	public RenderGroup(){
		
	}
	public DHVector4 getAmbient(){
		return null;
	}
	public void getBoneData(){
		
	}
	public DHVector4 getDiffuse(){
		return null;
	}
	public WebGLShortArray getIndexData(){
		return null;
	}
	public float getShininess(){
		return 0f;
	}
	public DHVector4 getSpecular(){
		return null;
	}
}
