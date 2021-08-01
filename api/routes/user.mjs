import { scryptSync, randomBytes } from 'crypto'
import getSessionMiddleware from '../middlewares/getSession.mjs'
const getHash = (password, salt) => scryptSync(password, salt, 32).toString('hex')
export default (server, db) => {
  const getUser = db.prepare('SELECT * FROM users WHERE username = ?;')
  const getSession = db.prepare('SELECT * FROM sessions WHERE user = ?;')
  const deleteSessions = db.prepare('DELETE FROM sessions WHERE user = ?;')
  const generateSession = db.prepare("INSERT INTO sessions (user, created, last_used, uuid) VALUES (?, datetime('now'), datetime('now'), uuid());")
  const createUser = db.prepare('INSERT INTO users (username, password, salt) VALUES (?, ?, ?);')
  server.put('/user/login', (req, res) => {
    const { username, password } = req.data
    const user = getUser.get(username)

    if (!user || user.password !== getHash(password, user.salt)) {
      return res.status(401).send('bad login homie')
    }
    deleteSessions.run(user.id)
    generateSession.run(user.id)
    res.status(200).send(JSON.stringify(getSession.get(user.id)))
  })
  server.post('/user', [getSessionMiddleware], (req, res) => {
    const salt = randomBytes(16).toString('hex')
    const { username, password } = req.data
    const hashed = getHash(password, salt)
    createUser.run(username, hashed, salt)
    res.status(200).send('ok')
  })
}
