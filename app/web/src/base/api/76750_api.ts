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
  if (user.role === "admin") {
    const payload = {
      resource: req.body.resource,
      params: req.body.params,
      exp: Math.round(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    };

    const METABASE_SECRET_KEY = await db.m_config.findFirst({
      where: {
        type: "METABASE_SECRET_KEY"
      }
    })

    var token = ext.jwt.sign(payload, METABASE_SECRET_KEY.value);

    reply.send({
      status: "success",
      token: token
    })
  } else {
    reply.send({
      status: "error",
      message: "you done have access"
    })
  }
}