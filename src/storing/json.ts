 
const fs = require("fs")
const path_ = require("path")

 
interface JSONStoring {
  name: string;
  path: string;
  cache: any;
  opt: any;
  
}
 
interface Options {
  path: string;
  caching: boolean;
  noRealTimeUpdate: boolean;
}

class JSONStoring {
  constructor(name: string, options: Options) {
    this.name = name
    this.path = path_.join(path_.resolve(options.path), `${name}.json`)
    this.cache = null
    this.opt = options
    this.opt.startMiddle = this.opt.startMiddle 
    this.opt.endMiddle = this.opt.endMiddle  

    if (fs.existsSync(this.path)) {
      if (options.caching) {
        this.cache = this.opt.endMiddle(fs.readFileSync(this.path, "utf8"))
      }
    } else {
      fs.writeFileSync(this.path, "{}")
      if (options.caching) this.cache = {}
    }

   /*
    if (options.noRealTimeUpdate) {
      Array.from([`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`]).forEach((eventType) => {
        process.once(eventType, write.bind(this))
      })
    }
   */
  }

  set(k: string, v: any) {
    return new Promise(async (resolve) => {
      var cache: any = await this.all()
      cache[k] = v
      this._write(cache)
      return resolve(void 0)
    })
  }


  remove(k: string) {
    return new Promise(async (resolve) => {
      var cache: any = await this.all()
      delete cache[k]
      cache = this.opt.endMiddle(this.opt.startMiddle(cache))
      this._write(cache)
      return resolve(void 0)
    })
  }

  get(k: string) {
    return new Promise(async (resolve) => {
      var result: any = await this.all()
      return resolve(result[k])
    })
  }

  add(k: string, v:any) {
    return new Promise(async (resolve) => {
      var cache: any = await this.all()
      cache[k] += v
      this._write(cache)
      return resolve(void 0)
    })
  }

  subtract(k: string, v:any) {
    return new Promise(async (_resolve) => {
      var cache:any = await this.all()
      cache[k] -= v
      return this._write(cache)
    })
  }

  push(k: string, v:any) {
    return new Promise(async (resolve) => {
      var cache: any = await this.all()
      cache[k].push(v)
      this._write(cache)
      return resolve(void 0)
    })
  }

  has(k: string) {
    return new Promise(async (resolve) => {
      var result: any = await this.all()
      return resolve(result.hasOwnProperty(k))
    })
  }

  all() {
    return new Promise(async (resolve) => {
      return resolve(this.opt.caching ? this.cache : this.opt.endMiddle(fs.readFileSync(this.path, "utf8")))
    })
  }

  _write(cache=this.cache) {
    if (!this.opt.noRealTimeUpdate) fs.writeFileSync(this.path, this.opt.startMiddle(cache))
    return this
  }

  disconnect() {}
}

export default JSONStoring