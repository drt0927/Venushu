import { boardModel, customerModel, orderModel, scheduleModel, tradeModel } from './index'

export default {
  getBoardModel () {
    return Object.assign(boardModel)
  },
  getCustomerModel () {
    return Object.assign(customerModel)
  },
  getOrderModel () {
    return Object.assign(orderModel)
  },
  getScheduleModel () {
    return Object.assign(scheduleModel)
  },
  getTradeModel () {
    return Object.assign(tradeModel)
  }
}
