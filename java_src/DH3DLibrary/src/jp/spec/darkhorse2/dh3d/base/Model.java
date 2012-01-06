/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class Model {
	public Skin[] skinArray;
	public Skin[] dynamicSkinArray;
	public int dynamicSkinOffset;
	public int[] indexArray;
	public Material[] materialArray;
	public Bone[] boneArray;
	public Bone<String> boneHash;
	public Bone rootBone;
	public IK[] ikArray;
	public RigidBody[] rigidBodyArray;
	public Constraint[] constraintArray;
	public RenderGroup[] renderGroupArray;
	public WebGLBuffer vertexBuffer;
	
	public Model(){
		
	}
	public Model clone(){
		return null;
	}
	public Bone cloneBoneRecursive(Bone bone, Bone[] oldArray, Hash oldHash, Bone[] newArray, Hash newHash){
		return null;
	}
	public RenderGroup[] cloneRenderGroup(RenderGroup[] oldGroup, Bone[] newBoneArray){
		return null;
	}
	public Skin[] getDynamicSkinArray(){
		return null;
	}
	public WebGLFloatArray getDynamicVertexData(){
		return null;
	}
	public Skin[] getSkinArray(){
		return null;
	}
	public WebGLFloatArray getVertexData(){
		return null;
	}
}
