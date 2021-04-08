export default (req, mwExtras) => {
  var getSession = mwExtras.db.prepare("SELECT * FROM sessions WHERE uuid = ?");
  const session = getSession.get(req.headers.session);
  console.log('gotsession', session);
  return {
    ...req,
    session
  };
};
