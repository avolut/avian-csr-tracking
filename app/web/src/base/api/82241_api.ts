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
  const { data, method = 'update' } = req.body

  const { id, name, username, role, password } = data
  try {
    const hash = await ext.Password.hash(password)

    if (method === 'update') {
      if (password) {
        await db.m_user.update({
          where: { id: data.id },
          data: { name, username, role, password: hash },
        })
      } else {
        await db.m_user.update({
          where: { id: data.id },
          data: { name, username, role },
        })
      }
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
