/**
 * 
 */
package jp.spec.darkhorse2.dh3d.renderer.simple;

import jp.spec.darkhorse2.dh3d.base.*;
import webgl.*;

/**
 * @author Norihiro
 *
 */
public class SimpleVertexShader extends VertexShader{
	private String _name;
	private String _program;
	private WebGLUniformLocation _lTypeLoc;
	private WebGLUniformLocation _lPositionLoc;
	private WebGLUniformLocation _lAmbientLoc;
	private WebGLUniformLocation _lDiffuseLoc;
	private WebGLUniformLocation _lSpecularLoc;
	private WebGLUniformLocation _mAmbientLoc;
	private WebGLUniformLocation _mDiffuseLoc;
	private WebGLUniformLocation _mSpecularLoc;
	private WebGLUniformLocation _mShininessLoc;
	
	public SimpleVertexShader(WebGLRenderingContex gl){
		
	}
	public void bindAttribute(WebGLProgram programObject){
		
	}
	public void bindAttribute2(WebGLProgram programObject){
		
	}
	public void bufferDynamicVertexData(DH3DObject dhObject){
		
	}
	public void setAttribPointer(){
		
	}
	public void setLightData(Light light){
		
	}
	public void setMaterialData(Material material){
		
	}
	public WebGLFloatArray getVertexData(DH3DObject dhObject){
		return null;
	}
	public WebGLFloatArray getDynamicVertexData(DH3DObject dhObject){
		return null;
	}

}
