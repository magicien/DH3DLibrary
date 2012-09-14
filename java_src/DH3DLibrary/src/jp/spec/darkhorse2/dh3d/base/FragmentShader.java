/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;

/**
 * @author Norihiro
 *
 */
public class FragmentShader {
	private WebGLShader _shader;
	private WebGLRenderingContex _context;
	private String _name;
	private String _program;
	
	public FragmentShader(WebGLRenderingContex gl){
		
	}
	public String getName(){
		return _name;
	}
	public WebGLShader getShader(){
		return this._shader;
	}
}
