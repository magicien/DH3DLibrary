/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

import webgl.*;
import canvas.*;

/**
 * @author Norihiro
 *
 */
public class CanvasField {
	private HTMLCanvasElement _canvas;
	private HTMLCanvasElement _2DCanvas;
	private WebGLRenderingContex _gl;
	private WebGLProgram _program;
	private CanvasRenderingContext2D _2DContext;
	private ModelBank _modelBank;
	private MotionBank _motionBank;
	private TextureBank _textureBank;
	private Camera[] _cameras;
	private Light[] _lights;
	private float _fps;
	private Logger _logger;
	private int _canvasWidth;
	private int _canvasHeight;
	private float _widthPerX;
	private float _cameraFar;
	private float _cameraNear;
	private int _timer;
	private int _prevTime;
	private int _spf;
	private DH3DObject[] _objs;
	
	public CanvasField(HTMLCanvasElement canvasElement){
		
	}
	public void addObject(DH3DObject obj){
		
	}
	public void checkGLError(String message){
		
	}
	public void debug(String message){
		
	}
	public void drawPicture(){
		
	}
	public Camera[] getCameras(DH3DObject obj){
		return null;
	}
	public WebGLRenderingContext getContext(){
		return null;
	}
	public int getFPS(){
		return 0;
	}
	public Light[] getLights(){
		return null;
	}
	public Logger getLogger(){
		return null;
	}
	public WebGLProgram getProgram(){
		return null;
	}
	public void log(String message){
		
	}
	public void pause(){
		
	}
	public void removeObject(DH3DObject obj){
		
	}
	public void reshape(){
		
	}
	public void setCamera(Camera camera){
		
	}
	public void setFPS(int fps){
		
	}
	public void setLights(Light light){
		
	}
	public void setLogger(Logger logger){
		
	}
	public void setProgram(WebGLProgram program){
		
	}
	public void start(){
		
	}
	public void useProgram(){
		
	}
}
