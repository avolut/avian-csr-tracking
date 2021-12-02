async ({
  template,
  params,
  render,
  db,
  req,
  reply,
  user,
  log,
  ext,
  isDev,
}: Server) => {
  const { username, password, role } = req.body

  let login;
  let userFound;

  const checkUserFound = (login) => {
    if (login === undefined || login === null) return false;
    return true;
  };

  const checkPasswordMatch = async (password, passwordHash) => {
    try {
      if (await ext.Password.verify(password, passwordHash)) return true;
      else return false;
    } catch (err) {
      console.error(err);
    }

    return false;
  };


  login = await db.m_user.findFirst({
    where: { username: req.body.username },
  });
  userFound = checkUserFound(login);

  if (userFound) {
    const passwordMatch = await checkPasswordMatch(password, login.password);
    if (!passwordMatch)
      return reply.send({
        status: "failed",
        msg: "Username or password wrong!",
      });
  } else {
    return reply.send({
      status: "failed",
      msg: "User not found",
    });
  }

  const data = { ...login };
  console.log(login)
  req.session.user = data;
  req.session.role = data.role;

  reply.send({
    status: "success",
    user: data,
  })
}