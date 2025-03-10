const mysql = require('sync-mysql');
const sql = require('sql');

interface MySQLStoring {
  name: string;
  opt: any,
  connection: any;
  table: any;
 
}

class MySQLStoring {
  constructor(name: string, options={} as any) {
    this.name = name
    this.opt = options
    this.opt.startMiddle = this.opt.startMiddle || ((n: any) => n)
    this.opt.endMiddle = this.opt.endMiddle || ((n: any) => n)

    this.connection = new mysql({
      host: options.host,
      user: options.user,
      password: options.password,
      database: options.database
    });

    sql.setDialect("mysql")

    this.table = sql.define({
			name: name,
			columns: [
				{
					name: 'key',
					primaryKey: true,
					dataType: `VARCHAR(255)`
				},
				{
					name: 'value',
					dataType: 'LONGTEXT'
				}
			]
		})

    this.connection.query(this.table.create().ifNotExists().toString())
  }

  set(k: string, v: any) {
    v = this.opt.startMiddle(v)
    k = k.replace(/\\/g, "\\\\")
    v = v.replace(/\\/g, "\\\\")
    this.connection.query(this.table.replace({ key: k, value: v }).toString())
    return this
  }

  remove(k: string) {
    this.connection.query(this.table.delete().where({ key: k }).toString())
    return this
  }

  get(k: string) {
    var r = this.connection.query(this.table.select().where({ key: k }).toString())[0].value;
    return this.opt.endMiddle(r)
  }

  add(k: string, v: any) {
    this.set(k, this.get(k) + v)
    return this
  }

  subtract(k: string, v: any) {
    this.set(k, this.get(k) - v)
    return this
  }

  push() {
    throw new Error("Since MySQL doesn't support array, so uwu")
  }

  has(k: string) {
    return this.all().hasOwnProperty(k)
  }

  all() {
    var all = this.connection.query("SELECT * FROM " + this.name)
    var items: any = {}
    all.map((a: any) => items[a.key] = this.opt.endMiddle(a.value))
    return items
  }

  disconnect() {}
}

export default MySQLStoring