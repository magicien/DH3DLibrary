/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class Constraint {
	public String name;
	public int bodyA;
	public int bodyB;
	public DHVector3 position;
	public DHVector3 rotate;
	public DHVector3 constraintPos1;
	public DHVector3 constraintPos2;
	public DHVector3 constraintRot1;
	public DHVector3 constraintRot2;
	public DHVector3 springPos;
	public DHVector3 springRot;
	
	public Constraint(){
		
	}
}
