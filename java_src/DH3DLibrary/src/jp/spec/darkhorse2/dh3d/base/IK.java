/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class IK {
	public Bone[] boneList;
	public DHVector3[] minAngleList;
	public DHVector3[] maxAngleList;
	public Bone[] targetBone;
	public Bone[] effectBone;
	public int iteration;
	public float fact;
	public int linkNo;
	private DHVector3 _angle;
	private DHVector3 _orgTargetPos;
	private DHVector3 _rotAxis;
	private DHVector4 _rotQuat;
	private DHMatrix _inverseMat;
	private DHVector3 _diff;
	private DHVector3 _effectPos;
	private DHVector3 _targetPos;
	
	public IK(){
		
	}
	public IK clone(){
		return null;
	}
	public void limitAngle(DHVector3 limitMinAngle, DHVector3  limitMaxAngle, DHVector4 quat){
		
	}
	public void update(){
		
	}
}
