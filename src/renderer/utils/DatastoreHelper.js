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
  }

  addQuery (q) {
    for (let key in q) {
      if (q[key] === null || q[key] === 'undefined') {
        return
      }
    }

    if (q !== null && q !== 'undefined') {
      this.query.$and.push(q)
    }
  }

  count (result) {
    const _self = this || result.self
    return new Promise((resolve, reject) => {
      _self.datastore.count(_self.query, (cntErr, count) => {
        if (cntErr) {
          _self.pagination.isBusy = false
          reject(cntErr)
          return
        }
        _self.pagination.totalRows = count
        _self.pagination.isBusy = false
        resolve({
          self: _self,
          data: count
        })
      })
    })
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

  find (result) {
    const _self = this || result.self
    return new Promise((resolve, reject) => {
      _self.datastore.find(_self.query)
        .sort(_self.sort)
        .skip((_self.pagination.currentPage - 1) * _self.pagination.perPage)
        .limit(_self.pagination.perPage)
        .exec((err, rows) => {
          if (err) {
            _self.pagination.isBusy = false
            reject(err)
            return
          }
          _self.pagination.isBusy = false
          resolve({
            self: _self,
            data: rows
          })
        })
    })
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
