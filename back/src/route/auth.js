const express = require('express')
const router = express.Router()
const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')

router.post('/signup', function (req, res) {
  const { email, password } = req.body
  console.log(email, password)

  if (!email || !password) {
    return res.status(400).json({
      message:
        'Необхідно передати всі дані для створення користувача',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message:
          'A user with the same name is already exist',
      })
    }

    const newUser = User.create({ email, password })

    const session = Session.create(newUser)

    console.log(session)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'Пользователь успешно зарегистрирован',
      session,
    })
  } catch (e) {
    return res.status(400).json({
      message: 'Ошибка создания пользователя',
    })
  }
})

//========================================

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  console.log(`Code: ${code}, Token: ${token}`)

  if (!code || !token) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const session = Session.get(token)

    console.log(session)

    if (!session) {
      return res.status(400).json({
        message: 'Помилки. Ви не увійшли в акаунт',
      })
    }

    const email = Confirm.getData(Number(code))

    console.log(email)

    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Код не дійсний',
      })
    }

    session.user.isConfirm = true

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true

    Notification.create(user.id, 'Announcement', 'New User')
    console.log(user)

    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

//===============================

router.post('/signin', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message:
        'Необхідно передати всі дані для входу в систему',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: 'Неправильний email або пароль',
      })
    }

    const session = Session.create(user)
    Notification.create(
      user.id,
      'Announcement',
      'Successful Login',
    )
    return res.status(200).json({
      token: session.token,
      email: user.email,
      userConfirm: user.isConfirm,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//======================

router.post('/recovery', function (req, res) {
  const { email } = req.body

  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не існує',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Код для відновлення відправлено',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

//============================================

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Коду не існує',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не існує',
      })
    }

    user.password = password

    console.log(user)

    const session = Session.create(user)
    Notification.create(
      user.id,
      'Warning',
      'Successful Recovery Password',
    )
    return res.status(200).json({
      message: 'Пароль змінено',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
