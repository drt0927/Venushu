'use strict'

export default class Query {
  constructor (ds) {
    this.datastore = ds
    this.filter = {
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

  setFilter (q) {
    this.filter.$and = []
    for (let key in q) {
      if (q[key].exp === 'like') {
        let temp = {}
        temp[key] = new RegExp(q[key].value)
        this.filter.$and.push(temp)
      } else if (q[key].exp === 'eq') {
        let temp = {}
        temp[key] = q[key].value
        this.filter.$and.push(temp)
      }
    }

    return this
  }

  getCount () {
    return this.pagination.totalRows
  }

  count () {
    this.datastore.count(this.filter, (cntErr, count) => {
      if (cntErr) {
        this.pagination.isBusy = false
        return
      }
      this.pagination.totalRows = count
      this.pagination.isBusy = false
    })

    return this
  }

  findOne (id, callback) {
    this.datastore.find({ _id: id }, (err, row) => {
      if (err || row.length < 1) {
        callback()
        return
      }
      callback(row[0])
    })

    return this
  }

  find (callback) {
    this.datastore.find(this.filter)
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
        callback(rows)
      })

    return this
  }

  update (id, item, callback) {
    this.datastore.update({ _id: id }, { $set: item }, {}, function (err, i) {
      if (err) {
        callback()
        return
      }
      callback(i)
    })

    return this
  }

  remove (id, callback) {
    this.datastore.remove({ _id: id }, {}, function (err, numRemoved) {
      if (err) {
        callback()
        return
      }
      callback(numRemoved)
    })

    return this
  }

  insert (item, callback) {
    this.datastore.insert(item, function (err, newDoc) {
      if (err) {
        callback()
        return
      }
      callback(newDoc)
    })

    return this
  }
}
