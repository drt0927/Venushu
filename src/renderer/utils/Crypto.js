
export default {
  key: 'TnguddlrkWkddldi1#2@3!',
  salt: 'rnldudnsTnguddl)3(2*1',
  crypto: require('crypto'),
  encrypt (text) {
    if (!text) {
      return ''
    }
    const cipher = this.crypto.createCipher('aes-256-cbc', this.key)
    let result = cipher.update(text, 'utf8', 'base64')
    result += cipher.final('base64')
    return result
  },
  decrypt (text) {
    if (!text) {
      return ''
    }
    const decipher = this.crypto.createDecipher('aes-256-cbc', this.key)
    let result = decipher.update(text, 'base64', 'utf8')
    result += decipher.final('utf8')
    return result
  },
  encryptSHA (text) {
    return new Promise((resolve, reject) => {
      this.crypto.pbkdf2(text, this.salt, 100000, 64, 'sha512', (err, key) => {
        if (err) {
          reject(err)
        } else {
          resolve(key.toString('base64'))
        }
      })
    })
  }
}
