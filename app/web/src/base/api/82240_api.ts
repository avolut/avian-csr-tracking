;async ({
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
  const { id, password, } = req.body
  try {
    const hash = await ext.Password.hash(password)

    await db.m_user.update({
      where: { id },
      data: { password: hash },
    })
  } catch (err) {
    console.log(err)
  }
  reply.send({
    status: 'success',
  })
}
