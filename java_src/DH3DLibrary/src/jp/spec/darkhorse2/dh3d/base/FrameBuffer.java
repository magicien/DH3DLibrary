/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class FrameBuffer {
	private int _width;
	private int _height;
	private Object _gl;
	private Object _frameBuffer;
	private Object _colorBuffer;
	private Object _depthBuffer;
	
	public FrameBuffer(Object gl,int width,int height){
		this._width = width;
		this._height = height;
		this._gl = gl;
	}
	
	public void begin(){
		
	}
	public void end(){
		
	}
}
