/**
 * 
 */
package jp.spec.darkhorse2.dh3d.base;

/**
 * @author Norihiro
 *
 */
public class KeyListener {
	private boolean _enable;
	private boolean[] _keyState;
	private boolean[] _keyNewState;
	
	public KeyListener(){
		
	}
	public boolean getKeyNewState(int keyCode){
		return false;
	}
	public boolean getKeyState(int keyCode){
		return false;
	}
	public void keyDownCallback(KeyListener obj, Event event){
		
	}
	public void keyUpCallback(KeyListener obj, Event event){
		
	}
	public void resetKeyNewState(){
		
	}
	public void resetKeyState(){
		
	}
	public void setDisable(){
		
	}
	public void setEnable(boolean flag){
		
	}

}
