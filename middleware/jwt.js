function verifyUsingJWT(req, res, next) {
  const token = req.headers.authorization;
  if (token === undefined) {
    return res.status(404).send({ message: "Please send token" });
  }
  let tokenValue = token.split(" ");
  tokenValue = tokenValue[1];
  req.token = tokenValue;
  next();
}

module.exports = { verifyUsingJWT };
