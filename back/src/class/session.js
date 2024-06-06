class Session {
  static #list = []

  constructor(user) {
    this.token = Session.generateCode()
    this.user = {
      email: user.email,
      isConfirm: user.isConfirm,
      id: user.id,
    }
  }

  static generateCode = () => {
    const length = 6
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkllmnopqrstuvwxyz0123456789'

    let result = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length,
      )
      result += characters[randomIndex]
    }

    return result
  }

  static create = (user) => {
    const session = new Session(user)

    this.#list.push(session)

    return session
  }

  static get = (token) => {
    return (
      this.#list.find((item) => item.token === token) ||
      null
    )
  }

  static update = (token, updatedSession) => {
    const index = this.#list.findIndex(
      (item) => item.token === token,
    )
    if (index !== -1) {
      this.#list[index] = updatedSession
    }
  }
}

module.exports = {
  Session,
}
