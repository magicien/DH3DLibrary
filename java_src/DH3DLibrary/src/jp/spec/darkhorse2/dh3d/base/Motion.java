/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class Motion {
	public String hashName; 
	public boolean loaded;
	public Object onload;
	public Motion[] motionArray;
	public int frameLength;
	public int defaultFPS;
	public boolean loop;
	
	public Motion(){
		
	}
	public Motion clone(){
		return this;
	}
	public void copy(Motion motion){
		
	}
	
}
