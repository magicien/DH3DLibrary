/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class DHMatrixWithArray {
	public Object data;
	public int rows;
	public int cols;
	
	public DHMatrixWithArray(){
		
	}
	
	public void copy(DHMatrixWithArray src){
		
	}
	
	public void identity(){
		
	}
	
	public boolean inverse(DHMatrixWithArray src){
		return true;
	}
	
	public boolean pseudoInverse(DHMatrixWithArray src){
		return true;
	}
	
	public boolean inverseLUD(DHMatrixWithArray src){
		return true;
	}
	
	public int luDecomp(DHMatrixWithArray src,Object ivec){
		return 0;
	}
	
	public void luInvert(DHMatrixWithArray src,Object ivec){
		
	}
	
	public boolean transpose(Object src){
		return true;
	}
	
	public void add(DHMatrixWithArray src1,DHMatrixWithArray src2){
		
	}
	
	public void sub(DHMatrixWithArray src1,DHMatrixWithArray src2){
		
	}
	
	public void multiplyScalar(DHMatrixWithArray src1,int val){
		
	}
	
	public boolean multiplyMatrix(DHMatrixWithArray src1,DHMatrixWithArray src2){
		return true;
	}
}
