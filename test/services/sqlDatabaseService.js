const pathUtils = require('path')
const fs = require('mz/fs')
const SqlDatabase = require('../../server/sqlDatabase')

module.exports = class SqlDatabaseService {
  async create () {
    const dbFilename = pathUtils.join(__dirname, '/test.db')
    if (await fs.exists(dbFilename)) {
      await fs.unlink(dbFilename)
    }
    this.db = new SqlDatabase({driver: 'sqlite', url: dbFilename})
    await this.db.createSchema()
    return this.db
  }

  async write (data) {
    await this.db.write(data)
  }

  async stop () {
    await this.db.stop()
  }
}
