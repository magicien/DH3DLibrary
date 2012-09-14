/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class VertexShader {
	private WebGLShader _shader;
	private WebGLRenderingContex _gl;
	private String _name;
	private String _program;
	
	public void VertexShader(WebGLRenderingContex gl){
		
	}
	public void bufferDynamicVertexData(DH3DObject dhObject){
		
	}
	public String getName(){
		return this._name;
	}
	public WebGLShader getShader(){
		return this._shader;
	}
	public void setAttribPointer(){
		
	}
	public void setMaterialData(Material material){
		
	}
	public void bindAttribute(WebGLProgram programObject){
		
	}
	public void bindAttribute2(WebGLProgram programObject){
		
	}
	public void setLightData(Light light){
		
	}
	public WebGLFloatArray getVertexData(DH3DObject dhObject){
		return null;
	}
	public WebGLFloatArray getDynamicVertexData(DH3DObject dhObject){
		return null;
	}
}
