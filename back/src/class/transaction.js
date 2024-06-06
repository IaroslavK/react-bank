class Transaction {
  static transactions = []

  static create(userId, type, amount, paymentSystem) {
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Некорректная сумма')
    }

    const newTransaction = {
      transactionId: Transaction.transactions.length + 1,
      userId,
      type,
      amount,
      paymentSystem,
      date: new Date().toISOString(),
    }
    Transaction.transactions.push(newTransaction)
    return newTransaction
  }

  static getByUserId(userId) {
    if (isNaN(userId) || userId <= 0) {
      throw new Error('Некорректный ID пользователя')
    }

    return Transaction.transactions.filter(
      (transaction) => transaction.userId === userId,
    )
  }

  static getById(transactionId) {
    if (isNaN(transactionId) || transactionId <= 0) {
      throw new Error('Некорректный ID транзакции')
    }

    return Transaction.transactions.find(
      (transaction) =>
        transaction.transactionId === transactionId,
    )
  }
}

module.exports = { Transaction }
