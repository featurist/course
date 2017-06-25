const pathUtils = require('path')
const fs = require('mz/fs')
const SqlDatabase = require('../../server/sqlDatabase')
const table = require('text-table')
const debug = require('debug')('sql')

module.exports = class RealDatabaseService {
  async create () {
    const dbFilename = pathUtils.join(__dirname, '/test.db')
    if (await fs.exists(dbFilename)) {
      await fs.unlink(dbFilename)
    }
    this.db = new SqlDatabase({driver: 'sqlite', url: dbFilename})
    await this.createSchema()
    return this.db
  }

  async printTables (log) {
    await this.printTable('artists', log)
    await this.printTable('artists_releases', log)
    await this.printTable('releases', log)
    await this.printTable('tracks', log)
  }

  async printTable (tableName, log = console.log) { // eslint-disable-line no-console
    const rows = await this.db.db.query(`select * from ${tableName}`)
    log('')
    log(`# ${tableName} (${rows.length})`)
    log('')
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
      log(table(tableRows).replace(/^/gm, '  '))
      log('')
    }
  }

  async createSchema () {
    await this.db.db.query(`
      create table artists (id integer primary key, name);
      create table artists_releases (artist_id, release_id);
      create table releases (id integer primary key, name);
      create table tracks (id integer primary key, name, number, duration, release_id);
    `, undefined, {multiline: true})
  }

  async write (data) {
    await this.db.write(data)
  }

  async stop () {
    await this.printTables(debug)
    await this.db.stop()
  }
}
