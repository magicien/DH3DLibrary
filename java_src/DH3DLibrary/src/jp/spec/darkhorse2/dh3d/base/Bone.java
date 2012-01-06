/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class Bone {
	public String name;
	public String englishName;
	int parentNo;
	public int childNo;
	public int kind;
	public int ikTarget;
	public DHVector3 position;
	public Bone parentBone;
	public Bone[] childBoneArray;
	public DHMatrix localMatrix;
	public DHVector4 rotate;
	public DHVector3 bonePosition;
	public DHVector3 offset;
	public DHMatrix offsetMatrix;
	public DHMatrix inflMatrix;
	public DHVector3 blendPosition;
	public DHVector4 blendRotation;
	
	public Bone(){
		
	}
	public void addChild(Bone childBone){
		
	}
	public Bone clone(){
		return null;
	}
	public void initBoneData(){
		
	}
	public void removeChild(Bone childBone){
		
	}
	public void reset(){
		
	}
	public void setBlendValue(){
		
	}
	public void setBlendValueRecursive(){
		
	}
	public void updateInflMatrix(){
		
	}
	public void updateMatrix(){
		
	}
	public void updateMatrixRecursive(){
		
	}
	
}
