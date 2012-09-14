/**
 * 
 */
package jp.spec.darkhorse2.dh3d;

/**
 * @author Norihiro
 *
 */
public class DH3DLibrary {
	public String Version;
	public String REQUIRED_PROTOTYPE;
	public String basePath;
	public String[] loadedFiles;
	
	public DH3DLibrary(){
		
	}
	
	public boolean loaded(String libraryName){
		return false;
	}
	
	public void require(String libraryName,String type){
		
	}
	
	public void load(String packageName,String fileList){
		
	}
	
	public void loadVertexShader(String packageName,String fileList){
		
	}
	
	public void loadFragmentShader(String packageName,String fileList){
		
	}
	
	public void loadPackage(String packageName){
		
	}
}