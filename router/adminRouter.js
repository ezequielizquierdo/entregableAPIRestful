const express = require('express')

const router = express.Router()

router.get(
  '/',
  function (req, res, next) {
    if (req.query.admin == 1) {
      console.log('se conecto un admin')
      next()
    } else {
      res.send({ error: 'usted no tiene acceso' })
    }
  },
  (req, res) => {
    res.render('admin')
  }
)

module.exports = router
