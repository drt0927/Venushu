export default {
  masking: {
    checkNull (str) {
      if (typeof str === 'undefined' || str === null || str === '') {
        return true
      } else {
        return false
      }
    },
    phone (str) {
      let originStr = str
      let phoneStr
      let maskingStr
      if (this.checkNull(originStr) === true) {
        return originStr
      }

      if (originStr.toString().split('-').length !== 3) {
        // 1) -가 없는 경우
        phoneStr = originStr.length < 11 ? originStr.match(/\d{10}/gi) : originStr.match(/\d{11}/gi)
        if (this.checkNull(phoneStr) === true) {
          return originStr
        }

        if (originStr.length < 11) {
          // 1.1) 0110000000
          maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{3})(\d{4})/gi, '$1***$3'))
        } else {
          // 1.2) 01000000000
          maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{4})(\d{4})/gi, '$1****$3'))
        }
      } else {
        // 2) -가 있는 경우
        phoneStr = originStr.match(/\d{2,3}-\d{3,4}-\d{4}/gi)
        if (this.checkNull(phoneStr) === true) {
          return originStr
        }

        if (/-[0-9]{3}-/.test(phoneStr)) {
          // 2.1) 00-000-0000
          maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{3}-/g, '-***-'))
        } else if (/-[0-9]{4}-/.test(phoneStr)) {
          // 2.2) 00-0000-0000
          maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{4}-/g, '-****-'))
        }
      }
      return maskingStr
    }
  },
  check: {
    phone (str) {
      var regExp = /(01[0|1|6|9|7])(\d{3}|\d{4})(\d{4}$)/g
      var result = regExp.exec(str)
      if (!result) {
        return false
      }
      return true
    }
  },
  messageBox: {
    showMessageBox (vm, title, message) {
      return new Promise((resolve, reject) => {
        vm.$bvModal.msgBoxOk(message, {
          title: title,
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
          .then((value) => {
            resolve(value)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    showConfirmBox (vm, title, message, okText, cancelText, okColor) {
      return new Promise((resolve, reject) => {
        vm.$bvModal.msgBoxConfirm(message, {
          title: title,
          size: 'sm',
          buttonSize: 'sm',
          okVariant: okColor,
          okTitle: okText,
          cancelTitle: cancelText,
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            resolve(value)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    showToast (vm, title, message, color) {
      vm.$bvToast.toast(message, {
        title: title,
        variant: color || 'danger',
        solid: true
      })
    }
  },
  enum: {
    boardType: {
      notice: '공지사항',
      comment: '코멘트'
    },
    emitMessage: {
      SET_MENU_NAVIGATE: 'SET_MENU_NAVIGATE'
    }
  }
}
