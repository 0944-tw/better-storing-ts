const Redis = require('ioredis');

interface redis {
  name: string;
  redis: any;
  namespace: string;
  opt: any;

}
class redis {
	constructor(name: string, opt={} as any) {
		this.name = name;

		this.redis = new Redis(opt);

    this.namespace = `namespace:${this.name}`

    this.opt = opt

    this.opt.startMiddle = this.opt.startMiddle || ((n: any) => n)

    this.opt.endMiddle = this.opt.endMiddle || ((n:any) => n)

		this.redis.on('error', (err: any) => console.error(`[REDIS] ${err.toString()}`));

    if (opt.leave_on_exit) {
      process.on("exit", this.disconnect)
    }
	}

	async get(k: string) {
		var v = await this.redis.get(k)
		return this.opt.endMiddle(v);
	}

	async set(key: string, value: any) {
		return await this.redis.set(key, this.opt.startMiddle(value));
	}

	remove(key: string) {
		return this.redis.del(key)
	}

  async add(k: string, v: any) {
    await this.set(k, (await this.get(k)) + v)
    return this
  }

  async subtract(k: string, v: any) {
    await this.set(k, (await this.get(k)) - v)
    return this
  }

  push() {
    throw new Error("Since Redis doesn't support array, so uwu")
  }

  async has(k: string) {
    var all = await this.all()
    return all.hasOwnProperty(k)
  }

	async all() {
    var allres = await this.redis.keys('*')
    allres = allres.filter((item: any) => item !== this.namespace)
    var res = await Promise.all(allres.map(async (item: any) => { return { name: item, value: await this.get(item) }}))
    var items = {} as any
    res.map(a => items[a.name] = a.value)
    return items
  }

  disconnect() {
    return this.redis.disconnect()
  }
}

export default redis