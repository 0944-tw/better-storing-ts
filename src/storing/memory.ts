interface MemoryStoring{
    name: string;
    cache: any;
    
} 

class MemoryStoring {
    constructor(name: string) {
      this.name = name
      this.cache = {}
    }
  
    set(k: string, v: any) {
      return new Promise(async (resolve: any) => {
        this.cache[k] = v
        resolve()
      })
    }
  
  
    remove(k: string) {
      return new Promise(async (resolve: any) => {
        delete this.cache[k]
        resolve()
      })
    }
  
    get(k: string) {
      return new Promise(async (resolve: any) => {
        return resolve(this.cache[k])
      })
    }
  
    add(k: string, v: any) {
      return new Promise(async (resolve: any) => {
        this.cache[k] += v
        resolve()
      })
    }
  
    subtract(k: string, v: any) {
      return new Promise(async (resolve: any) => {
        this.cache[k] -= v
        resolve()
      })
    }
  
    push(k: string, v: any) {
      return new Promise(async (resolve: any) => {
        this.cache[k].push(v)
        resolve()
      })
    }
  
    has(k: string) {
      return new Promise(async (resolve: any) => {
        return resolve(this.cache.hasOwnProperty(k))
      })
    }
  
    all() {
      return new Promise(async (resolve: any) => {
        return resolve(this.cache)
      })
    }
  
    disconnect() {
        this.cache = null
    }
  }
  
  export default MemoryStoring;