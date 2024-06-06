class Notification {
  static #list = []

  static create(userId, type, message) {
    const notification = {
      id: Notification.generateId(),
      userId,
      type,
      message,
      timestamp: new Date().toISOString(),
    }
    this.#list.push(notification)
  }

  static getByUserId(userId) {
    return this.#list.filter(
      (notification) => notification.userId === userId,
    )
  }

  static generateId() {
    return '_' + Math.random().toString(36).substr(2, 9)
  }
}

module.exports = { Notification }
