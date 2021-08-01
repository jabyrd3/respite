export default (req, res, mwExtras) => {
  var getSessionStatement = mwExtras.db.prepare("SELECT * FROM sessions WHERE uuid = ?;");
  const countUsersStatement = mwExtras.db.prepare('SELECT count(id) FROM users;')
  const count = countUsersStatement.get()

  const session = getSessionStatement.get(req.headers.session);
  if (!session && count['count(id)'] > 0) {
    res.status(401).send('invalid session');
    res = false;
  }
  return {
    req: {
      ...req,
      session
    },
    res
  };
};
