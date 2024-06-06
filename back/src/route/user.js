const express = require('express')
const router = express.Router()
const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')
const { Transaction } = require('../class/transaction')

router.post('/change-email', (req, res) => {
  const { email, password } = req.body
  const token = req.headers.authorization.split(' ')[1]

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res
        .status(401)
        .json({ message: 'Не авторизований' })
    }

    const user = User.getByEmail(session.user.email)

    if (password !== user.password) {
      return res
        .status(400)
        .json({ message: 'Неправильний пароль' })
    }

    user.email = email

    session.user.email = email
    Session.update(token, session)

    Notification.create(user.id, 'Warning', 'New Email')

    console.log(user)
    return res
      .status(200)
      .json({ message: 'Email змінено', email })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

//=====================================================================

router.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const token = req.headers.authorization?.split(' ')[1]

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  if (!token) {
    return res
      .status(400)
      .json({ message: 'Не авторизований' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res
        .status(400)
        .json({ message: 'Не авторизований' })
    }

    const user = User.getByEmail(session.user.email)

    if (!user || user.password !== oldPassword) {
      return res
        .status(400)
        .json({ message: 'Неправильний старий пароль' })
    }

    user.password = newPassword
    Notification.create(user.id, 'Warning', 'New Password')
    console.log(user)
    return res
      .status(200)
      .json({ message: 'Пароль змінено' })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

//=====================================================================

router.get('/notifications', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res
      .status(400)
      .json({ message: 'Не авторизований' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res
        .status(400)
        .json({ message: 'Не авторизований' })
    }

    const notifications = Notification.getByUserId(
      session.user.id,
    )
    return res.status(200).json({ notifications })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

//=====================================================================

router.get('/balance', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Не авторизован' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res
        .status(401)
        .json({ message: 'Не авторизован' })
    }

    const user = User.getById(session.user.id)
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })
    }

    const transactions = Transaction.getByUserId(
      session.user.id,
    )
    console.log('Transactions:', transactions)

    return res
      .status(200)
      .json({ balance: user.balance, transactions })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

//=====================================================================

router.post('/receive', (req, res) => {
  const { amount, paymentSystem } = req.body
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Не авторизован' })
  }

  if (!amount || isNaN(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ message: 'Некорректная сумма' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res
        .status(401)
        .json({ message: 'Не авторизован' })
    }

    const user = User.getById(session.user.id)
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })
    }

    user.balance += amount

    Notification.create(
      user.id,
      'Payment',
      `Баланс пополнен на $${amount} с помощью ${paymentSystem}`,
    )
    Transaction.create(
      user.id,
      'receive',
      amount,
      paymentSystem,
    )

    return res.status(200).json({
      message: 'Баланс успешно пополнен',
      balance: user.balance,
    })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

//=======================================================================

router.get('/transactions', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Не авторизован' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res
        .status(401)
        .json({ message: 'Не авторизован' })
    }

    const transactions = Transaction.getByUserId(
      session.user.id,
    )
    return res
      .status(200)
      .json({ transactions: transactions })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

//=======================================================================

router.get('/transaction/:transactionId', (req, res) => {
  const transactionId = parseInt(req.params.transactionId)
  const numericTransactionId = Number(transactionId)

  if (isNaN(numericTransactionId)) {
    return res
      .status(400)
      .json({ message: 'Некорректный ID транзакции' })
  }

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Не авторизован' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res
        .status(401)
        .json({ message: 'Не авторизован' })
    }

    const transaction = Transaction.getById(
      numericTransactionId,
    )

    if (!transaction) {
      return res
        .status(404)
        .json({ message: 'Транзакция не найдена' })
    }

    let userEmail
    if (transaction.type === 'send') {
      const recipient = User.getById(transaction.userId)
      userEmail = recipient ? recipient.email : 'Unknown'
    } else if (transaction.type === 'receive') {
      if (transaction.paymentSystem) {
        userEmail = transaction.paymentSystem
      } else {
        const sender = User.getById(transaction.userId)
        userEmail = sender ? sender.email : 'Unknown'
      }
    }

    return res.status(200).json({ transaction, userEmail })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

//=======================================================================
router.post('/send', (req, res) => {
  const { email, amount } = req.body
  console.log('Email: ', email)
  console.log('Amount: ', amount)

  const token = req.headers.authorization?.split(' ')[1]

  console.log(
    `Received request to send money: email=${email}, amount=${amount}`,
  )

  if (!token) {
    console.log('Authorization token not provided')
    return res
      .status(401)
      .json({ message: 'Не авторизован' })
  }

  const session = Session.get(token)

  if (!session) {
    console.log('Session not found for provided token')
    return res
      .status(401)
      .json({ message: 'Не авторизован' })
  }

  const sender = User.getByEmail(session.user.email)
  console.log('Sender: ', sender)

  const receiver = User.getByEmail(email)
  console.log('Receiver: ', receiver)

  if (!receiver) {
    console.log(`Receiver with email ${email} not found`)
    return res
      .status(404)
      .json({ message: 'Получатель не найден' })
  }

  const numericAmount = Number.parseFloat(amount)
  console.log('Numeric amount:', numericAmount)

  if (isNaN(numericAmount) || numericAmount <= 0) {
    console.log(`Invalid amount provided: ${amount}`)
    return res
      .status(400)
      .json({ message: 'Некорректная сумма' })
  }

  if (sender.balance < numericAmount) {
    console.log('Sender has insufficient balance')
    return res
      .status(400)
      .json({ message: 'Недостаточно средств' })
  }

  try {
    Transaction.create(
      sender.id,
      'send',
      numericAmount,
      receiver.email,
    )
    Transaction.create(
      receiver.id,
      'receive',
      numericAmount,
      sender.email,
    )

    Notification.create(
      sender.id,
      'Send',
      `Вы отправили ${numericAmount} USD на ${email}`,
    )
    Notification.create(
      receiver.id,
      'Payment',
      `Вы получили ${numericAmount} USD от ${sender.email}`,
    )

    sender.balance -= numericAmount
    receiver.balance += numericAmount

    console.log('Money sent successfully')
    return res
      .status(200)
      .json({ message: 'Деньги успешно отправлены' })
  } catch (err) {
    console.error('Error processing the request:', err)
    return res.status(500).json({ message: err.message })
  }
})
//=============================================================================
module.exports = router
