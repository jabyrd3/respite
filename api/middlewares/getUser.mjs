export default (req) => ({...req, userid: parseInt(req.headers.user_id, 10)});
