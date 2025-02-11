import BCrypt from 'bcryptjs'

export const name = 'PASSWORD_BCRYPT'

export var expression = /\$(2[a|x|y])\$(\d+)\$(.{53})/g
var defaultOptions = {
  cost: 10,
}

export function verify(password, hash) {
  expression.lastIndex = 0
  var match = expression.exec(hash)
  hash = '$2a$' + match[2] + '$' + match[3]
  return BCrypt.compareSync(password, hash)
}

export function hash(password, options) {
  expression.lastIndex = 0
  var salt
  if (typeof options == 'undefined') {
    options = defaultOptions
  }
  if (typeof options.cost == 'undefined') {
    options.cost = defaultOptions.cost
  }
  if (options.cost < defaultOptions.cost) {
    options.cost = defaultOptions.cost
  }
  if (typeof options.salt !== 'undefined') {
    console.log(
      "Warning: Password.hash(): Use of the 'salt' option to Password.hash is deprecated"
    )
    if (options.salt.length < 16) {
      throw (
        'Provided salt is too short: ' + options.salt.length + ' expecting 16'
      )
    }
    salt = '$2y$' + options.cost + '$' + options.salt
  } else {
    salt = BCrypt.genSaltSync(options.cost)
  }
  var hash = BCrypt.hashSync(password, salt)
  var output = expression.exec(hash)
  return '$2y$' + options.cost + '$' + output[3]
}

export function cost(hash) {
  expression.lastIndex = 0
  var match = expression.exec(hash)
  if (typeof match[2] !== 'undefined') {
    return parseInt(match[2])
  }
  return 0
}
