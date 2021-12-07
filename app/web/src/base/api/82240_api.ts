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
  const { id, password, method = 'update', data } = req.body
  try {
    const hash = await ext.Password.hash(password)
    if (method === 'update') {
      await db.m_user.update({
        where: { id },
        data: { password: hash },
      })
    } else {
      await db.m_user.create({
        data: {
          password: hash,
          name: data.name,
          username: data.username,
          last_login: new Date(),
          role: data.role,
        },
      })
    }
  } catch (err) {
    console.log(err)
  }
  reply.send({
    status: 'success',
  })
}
