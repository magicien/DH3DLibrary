/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class Renderer {
	private String _vertexShaderName;
	private String _fragmentShaderName;
	private WebGLRenderingContex _gl;
	private VertexShader _vertexShader;
	private FragmentShader _fragmentShader;
	private WebGLProgram _programObject;
	private Camera _camera;
	private Light _light;
	
	public Renderer(WebGLRenderingContex gl, Camera camera){
		
	}
	public WebGLRenderingContex getContext(){
		return null;
	}
	public float getDynamicVertexData(){
		return 0.0f;
	}
	public float getVertexData(){
		return 0.0f;
	}
	public void render(DH3DObject dhObject){
		
	}
	public void setCamera(Camera camera){
		
	}
	public void setLight(Light light){
		
	}
}
