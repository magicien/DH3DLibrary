/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class MessageWindow {
	private Object _bindedObject;
	private Object _bindedCanvas;
	private Object _bindedCamera;
	private Object _bindedBone;
	private Object _time;
	private Object _speed;
	public int MODE_READY;
	public int MODE_OPEN;
	public int MODE_STRING;
	public int MODE_STAY;
	public int MODE_CLOSE;
	public int _mode;
	private int _x;
	private int _y;
	private String _message;
	private Object[] _formattedMessage;
	private int _lines;
	private int _lineHeight;
	private int _messageWidth;
	private int _messageHeight;
	private int _messageNumChars;
	private int _maxWidth;
	private Object _offset;
	private Object _screenOffset;
	private int _margin;
	private int _padding;
	private int _iconPadding;
	private Object _icon;
	private String _borderColor;
	private String _backgroundColor;
	private int _globalAlpha;
	private String _globalCompositeOperation;
	private String _lineCap;
	private String _lineJoin;
	private int _lineWidth;
	private int _miterLimit;
	private int _balloonShadowBlur;
	private String _balloonShadowColor;
	private int _balloonShadowOffsetX;
	private int _balloonShadowOffsetY;
	private String _textColor;
	private String _font;
	private String _textAlign;
	private String _textBaseline;
	private String _textShadowBlur;
	private String _textShadowColor;
	private int _textShadowOffsetX;
	private int _textShadowOffsetY;
	
	public MessageWindow(){
		
	}
	public void animate(float elapsedTime){
		
	}
	public void render(){
		
	}
	private void _drawIconAndText(int len){
		
	}
	public void setupTextContext(){
		
	}
	public void setupBalloonContext(){
		
	}
	public void drawBalloon(int speakerX,int speakerY,int left,int top,int width,int height){
		
	}
	public void open(){
		
	}
	public void close(){
		
	}
	public Object getContext(){
		return null;
	}
	public Object getCanvas(){
		return null;
	}
	public void setCanvas(Object canvas){
		
	}
	public Object getIcon(){
		return null;
	}
	public void setIcon(Object icon){
		
	}
	public Object getOffset(){
		return null;
	}
	public void setOffset(int x,int y,int z){
		
	}
	public Object getScreenOffset(){
		return null;
	}
	public void setScreenOffset(int x,int y,int z){
		
	}
	public String getMessage(){
		return this._message;
	}
	public void setMessage(String message){
		
	}
	public int getMaxWidth(){
		return this._maxWidth;
	}
	public void setMaxWidth(int maxWidth){
		
	}
	private void _updateMessageSize(){
		
	}
	private int _getLineChars(String str,int maxWidth){
		return 0;
	}
	
	public int getState(){
		return this._mode;
	}
}
