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
  const role = req.body.role;
  let password = req.body.password;

  let login;
  let userFound;

  const checkUserFound = (login) => {
    if (login === undefined || login === null) return false;
    return true;
  };

  const checkPasswordMatch = async (passwordHash, password) => {
    try {
      if (await ext.Password.verify(passwordHash, password)) return true;
      else return false;
    } catch (err) {
      console.error(err);
    }

    return false;
  };

  if (role === "admin") {
    login = await db.m_user.findFirst({
      where: { username: req.body.username },
    });
    userFound = checkUserFound(login);
    password = req.body.password;
  }

  if (userFound) {
    const passwordMatch = await checkPasswordMatch(login.password, password);
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

  const data = { role: role, ...login };
  req.session.user = data;
  req.session.role = role;

  reply.send({
    status: "success",
    user: data,
  })
}