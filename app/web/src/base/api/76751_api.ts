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
  req.session.user = {
    "role": "guest"
  };

  reply.send({
    status: "success",
  })
}