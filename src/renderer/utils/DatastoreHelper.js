export default {
  pagination: {
    currentPage: 1,
    perPage: 5,
    totalRows: 0,
    isBusy: false
  },
  findOne (datastore, id) {
    return new Promise((resolve, reject) => {
      datastore.find({ _id: id }, (err, row) => {
        if (err || row.length < 1) {
          reject(err)
          return
        }
        resolve(row[0])
      })
    })
  },
  find (datastore, query) {
    const p = this
    return new Promise((resolve, reject) => {
      datastore.count(query, (cntErr, count) => {
        if (cntErr) {
          p.pagination.isBusy = false
          reject(cntErr)
        }

        p.pagination.totalRows = count
        datastore.find(query)
          .sort({ createDate: -1 })
          .skip((p.pagination.currentPage - 1) * p.pagination.perPage)
          .limit(p.pagination.perPage)
          .exec((err, rows) => {
            if (err) {
              p.pagination.isBusy = false
              reject(err)
              return
            }
            p.pagination.isBusy = false
            resolve(rows)
          })
      })
    })
  },
  update (datastore, id, item) {
    return new Promise((resolve, reject) => {
      datastore.update({ _id: id }, { $set: item }, {}, function (err, i) {
        if (err) {
          reject(err)
          return
        }
        resolve(i)
      })
    })
  },
  remove (datastore, id) {
    return new Promise((resolve, reject) => {
      datastore.remove({ _id: id }, {}, function (err, numRemoved) {
        if (err) {
          reject(err)
          return
        }
        resolve(numRemoved)
      })
    })
  },
  insert (datastore, item) {
    return new Promise((resolve, reject) => {
      datastore.insert(item, function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve([])
      })
    })
  }
}
