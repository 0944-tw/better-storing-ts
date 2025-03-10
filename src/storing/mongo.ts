const { Database } = require("quickmongo");

interface opt {
  url: any;
  startMiddle: any;
  endMiddle: any;
}
interface mongo {
  name: string;
  opt: opt;
  mongo: any;

}
class mongo {
	constructor(name: string, opt={} as opt) {
		this.name = name;
    this.opt = opt as opt;
    this.opt.startMiddle = this.opt.startMiddle || ((n: any) => n)
    this.opt.endMiddle = this.opt.endMiddle || ((n: any) => n)

		this.mongo = new Database(opt.url);
    this.mongo.connect()
	}

	get(k: string) {
		return this.mongo.get(k)
      .then((v: any) => {
				return this.opt.endMiddle(v);
			});
	}

	set(k: string, v: any) {
		return this.mongo.set(k, this.opt.startMiddle(v));
	}

	remove(k: string) {
		return this.mongo.delete(k)
	}

  add(k: string, v: any) {
    return this.mongo.add(k, this.opt.startMiddle(v))
  }

  subtract(k: string, v: any) {
    return this.mongo.subtract(k, this.opt.startMiddle(v))
  }

  push(k: string, v: any) {
    return this.mongo.push(k, this.opt.startMiddle(v))
  }

  has(k: string) {
    return this.mongo.has(k)
  }

	async all() {
    var all = await this.mongo.all()
    var items: any = {}
    all.map((a: { ID: string; data: any }) => items[a.ID] = this.opt.endMiddle(a.data))
    return items
  }

  disconnect() {
    return this.mongo.disconnect()
  }
}

export default mongo