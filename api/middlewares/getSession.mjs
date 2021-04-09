export default (req, res, mwExtras) => {
  var getSession = mwExtras.db.prepare("SELECT * FROM sessions WHERE uuid = ?;");
  const session = getSession.get(req.headers.session);
  if(!session){
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
