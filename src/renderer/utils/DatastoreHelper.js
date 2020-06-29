'use strict'

export default class Query {
  constructor (ds) {
    this.datastore = ds
    this.query = {
      $and: []
    }
    this.pagination = {
      currentPage: 1,
      perPage: 15,
      totalRows: 0,
      isBusy: false
    }
    this.sort = {}
  }

  setSort (s) {
    this.sort = s
    return this
  }

  setQuery (q) {
    for (let key in q) {
      if (q[key].exp === 'like') {
        let temp = {}
        temp[key] = new RegExp(q[key].value)
        this.query.$and.push(temp)
      } else if (q[key].exp === 'eq') {
        let temp = {}
        temp[key] = q[key].value
        this.query.$and.push(temp)
      }
    }

    return this
  }

  count () {
    this.datastore.count(this.query, (cntErr, count) => {
      if (cntErr) {
        this.pagination.isBusy = false
        return
      }
      this.pagination.totalRows = count
      this.pagination.isBusy = false
    })

    return this
  }

  findOne (id, result) {
    const _self = this || result.self
    return new Promise((resolve, reject) => {
      _self.datastore.find({ _id: id }, (err, row) => {
        if (err || row.length < 1) {
          reject(err)
          return
        }
        resolve({
          self: _self,
          data: row[0]
        })
      })
    })
  }

  find (callback) {
    this.datastore.find(this.query)
      .sort(this.sort)
      .skip((this.pagination.currentPage - 1) * this.pagination.perPage)
      .limit(this.pagination.perPage)
      .exec((err, rows) => {
        if (err) {
          this.pagination.isBusy = false
          callback()
          return
        }
        this.pagination.isBusy = false
        console.log(rows)
        callback(rows)
      })
    return this
  }

  update (id, item, result) {
    const _self = this || result.self
    return new Promise((resolve, reject) => {
      _self.datastore.update({ _id: id }, { $set: item }, {}, function (err, i) {
        if (err) {
          reject(err)
          return
        }
        resolve({
          self: _self,
          data: i
        })
      })
    })
  }

  remove (id, result) {
    const _self = this || result.self
    return new Promise((resolve, reject) => {
      _self.datastore.remove({ _id: id }, {}, function (err, numRemoved) {
        if (err) {
          reject(err)
          return
        }
        resolve({
          self: _self,
          data: numRemoved
        })
      })
    })
  }

  insert (item, result) {
    const _self = this || result.self
    return new Promise((resolve, reject) => {
      _self.datastore.insert(item, function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve({
          self: _self,
          data: []
        })
      })
    })
  }
}
