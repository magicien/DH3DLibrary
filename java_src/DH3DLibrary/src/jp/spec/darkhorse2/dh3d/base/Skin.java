/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class Skin {
	public DHVector3 position;
	public DHVector3 normal;
	public TextureUV textureUV;
	public DHVector3 currentPosition;
	public DHVector3 currentNormal;
	public TextureUV currentTextureUV;
	public RenderGroup renderGroup;
	public int[] boneNum;
	public Bone[] bones;
	public float[] skinWeight;
	public int[] boneIndex;
	public int edge;
	public DHMatrix tempMatrix;
	
	public Skin(){
		
	}
}
