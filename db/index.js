const sqlite3 = require('better-sqlite3')

const db = new sqlite3('./db/index.db')

db.init = () => {
  db.exec('CREATE TABLE IF NOT EXISTS students (id INT, name TEXT, age INT, section INT, number TEXT, branch INT, approved INT)')
  db.exec('CREATE TABLE IF NOT EXISTS admins (login TEXT, password TEXT)')
}

db.find = (login) => {
	return db.prepare(`SELECT * FROM admins WHERE login = ?`).get(login)
}

db.approve = (id) => {
  db.prepare('UPDATE students SET approved = 1 WHERE id = ?').run(id)
}

db.new = (name, age, section, number, branch) => {
  let id = db.all().length + 1
  db.prepare('INSERT INTO students (id, name, age, section, number, branch, approved) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, name, age, section, number, branch, 0)
	return db.find(id)
}

db.all = () => {
	return db.prepare('SELECT * FROM students').all()
}

module.exports = db
