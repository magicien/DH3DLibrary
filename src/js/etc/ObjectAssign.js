// http://d.hatena.ne.jp/teramako/20140812/p1
const ObjectAssign = function(target, ...sources) {
  for(let source of sources){
    let keys = Object.getOwnPropertyNames(source)
    for(let key of keys){
      let desc = Object.getOwnPropertyDescriptor(source, key)
      if(desc && desc.enumerable){
        target[key] = source[key]
      }
    }
  }
  return target
}

export default ObjectAssign

