
export default {
  key: 'TnguddlrkWkddldi1#2@3!',
  crypto: require('crypto'),
  encrypt (text) {
    const cipher = this.crypto.createCipher('aes-256-cbc', this.key)
    let result = cipher.update(text, 'utf8', 'base64')
    result += cipher.final('base64')
    return result
  },
  decrypt (text) {
    const decipher = this.crypto.createDecipher('aes-256-cbc', this.key)
    let result = decipher.update(text, 'base64', 'utf8')
    result += decipher.final('utf8')
    return result
  }
}
