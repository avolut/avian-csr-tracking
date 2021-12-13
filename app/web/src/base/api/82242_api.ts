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
  const { judul, lokasi, type, latitude, longitude } = req.body
  const post = await fetch('http://dev.avianbrands.com/api/post-csr', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      judul,
      lokasi,
      type,
      latitude,
      longitude,
    }),
  })

  reply.send({
    status: 'success',
    res: post,
  })
}
