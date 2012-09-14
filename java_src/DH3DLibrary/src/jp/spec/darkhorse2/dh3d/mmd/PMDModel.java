/**
 * 
 */
package jp.spec.darkhorse2.dh3d.mmd;

import jp.spec.darkhorse2.dh3d.base.*;

/**
 * @author Norihiro
 *
 */
public class PMDModel extends Model{
	public float version;
	public String modelName;
	public String comment;
	public Face[] faceArray;
	public Face<String> faceHash;
	public int[] faceDisplayArray;
	public String[] boneDisplayNameArray;
	public int[] boneDisplayIndex;
	public int[] boneDisplayFrameIndex;
	public boolean englishCompatibility;
	public String englishName;
	public String englishComment;
	public String[] boneDisplayEnglishNameArray;
	
	
}
