const express = require('express')
const app = express()

const db = require('./db')
db.init()

app.set('view-engine', 'hbs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  let error = ''
  if (req.query.error == 'age') error = 'Введите возраст от 7 до 16'
  else if (req.query.error == 'section') error = 'Выберите секцию из списка и введите его номер'
  else if (req.query.error == 'branch') error = 'Выберите филиа из списка и введите его номер'
  const message = req.query.message == 'ok' ? 'Ваша заявка будет рассмотрена администраторами' : ''
  req.url = '/'
  res.render('index.hbs', { error, message })
})

app.post('/new', (req, res) => {
  const student = Object(req.body)
  student.age = Number(student.age)
  student.section = Number(student.section)
  student.branch = Number(student.branch)
  if (student.age < 7 || student.age > 16) res.redirect('/?error=age')
  if (student.section < 1 || student.section > 3) res.redirect('/?error=section')
  if (student.branch < 1 || student.branch > 3) res.redirect('/?error=branch')
  db.new(student.name, student.age, student.section, student.number, student.branch)
  res.redirect('/?message=ok')
})

app.get('/auth', (req, res) => {
  let error = ''
  if (req.query.error == 'nn') error = 'Неверные данные'
  res.render('auth.hbs', { error })
})

app.post('/auth', (req, res) => {
  const admin = db.find(req.body.login)
  console.log(admin.password, req.body.password)
  if (admin.password != req.body.password) res.redirect('/auth?error=nn')
  res.redirect('/admin')
})

app.get('/admin', (req, res) => {
  const newbies = db.all().filter(student => student.approved == 0)
  res.render('admin.hbs', { newbies })
})

app.get('/approve', (req, res) => {
  db.approve(Number(req.query.id))
  res.redirect('/admin')
})

app.listen(3000, () => {
  console.log('Сервер запущен')
})