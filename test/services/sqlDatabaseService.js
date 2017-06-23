/* eslint-disable no-console */
const pathUtils = require('path')
const fs = require('mz/fs')
const SqlDatabase = require('../../server/sqlDatabase')
const table = require('text-table')

module.exports = class SqlDatabaseService {
  async create () {
    const dbFilename = pathUtils.join(__dirname, '/test.db')
    if (await fs.exists(dbFilename)) {
      await fs.unlink(dbFilename)
    }
    this.db = new SqlDatabase({driver: 'sqlite', url: dbFilename})
    await this.createSchema()
    return this.db
  }

  async printTables () {
    await this.printTable('artists')
    await this.printTable('releases')
    await this.printTable('tracks')
  }

  async printTable (tableName) {
    const rows = await this.db.db.query(`select * from ${tableName}`)
    if (rows.length) {
      const keys = Object.keys(rows[0])

      const tableRows = rows.map((row) => {
        return keys.map((key) => {
          const value = row[key]
          return value !== null ? value : ''
        })
      })
      tableRows.unshift(keys.map((key) => Array(key.length + 1).join('=')))
      tableRows.unshift(keys)
      console.log()
      console.log('# ' + tableName)
      console.log()
      console.log(table(tableRows).replace(/^/gm, '  '))
      console.log()
    }
  }

  async createSchema () {
    await this.db.db.query(`
      create table artists (id integer primary key, name, release_id);
      create table releases (id integer primary key, name);
      create table tracks (id integer primary key, name, number, duration, release_id);
    `, undefined, {multiline: true})
  }

  async write (data) {
    await this.db.write(data)
  }

  async stop () {
    await this.db.stop()
  }
}
