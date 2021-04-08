export default (server, db) => {
  const getUser = db.prepare("SELECT * FROM users WHERE username = ?;");
  const getSession = db.prepare("SELECT * FROM sessions WHERE user = ?;");
  const deleteSessions = db.prepare("DELETE FROM sessions WHERE user = ?;");
  const generateSession = db.prepare("INSERT INTO sessions (user, created, last_used, uuid) VALUES (?, datetime('now'), datetime('now'), uuid());");
  server.put('/user/login', (req, res) => {
    const {username, password} = req.data;
    const user = getUser.get(username);

    if(!user || user.password !== password){
     return res.status(401).send('bad login homie');
    }
    deleteSessions.run(user.id);
    generateSession.run(user.id); 
    res.status(200).send(JSON.stringify(getSession.get(user.id)));
  });
}
