/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class RigidBody {
	public String name;
	public int boneIndex;
	public int groupIndex;
	public int groupTarget;
	public int shapeType;
	public float shapeW;
	public float shapeH;
	public float shapeD;
	public DHVector3 position;
	public DHVector3 rotate;
	public float weight;
	public float positionDim;
	public float rotateDim;
	public float recoil;
	public float friction;
	public int type;
	
	public RigidBody(){
		
	}
}
