/**
 * 
 */
package jp.spec.darkhorse2.dh3d.util;

/**
 * @author Norihiro
 *
 */
public class BinaryReader {
	public String url;
	public boolean bigEndian;
	public String encoding;
	public int position;
	public boolean eof;
	public Object parser;
	public Object data;
	public Object onloadFunc;
	
	public BinaryReader(String url,boolean bigEndian,String encoding,Object onload){
		
	}
	
	private void _onload(Object[] binData){
		
	}
	public boolean hasBytesAvailable(){
		return true;
	}
	public String readData(int length){
		return null;
	}
	public int readInteger(int length,int signed){
		return 0;
	}
	public byte readByte(){
		return 0;
	}
	public byte readUnsignedByte(){
		return 0;
	}
	public short readShort(){
		return 0;
	}
	public short readUnsignedShort(){
		return 0;
	}
	public int readInt(){
		return 0;
	}
	public int readUnsignedInt(){
		return 0;
	}
	public float readFloat(){
		return 0.0f;
	}
	public double readDouble(){
		return 0.0;
	}
	public String readString(int length){
		return null;
	}
}
