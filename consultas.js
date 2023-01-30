const { Pool } = require('pg')
const bcrypt = require('bcryptjs')


const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'softjobs',
    allowExitOnIdle: true
})

const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada
    const values = [email, passwordEncriptada, rol, lenguage]
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
    await pool.query(consulta, values)
}

const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 "
    const values = [email]
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: passwordEncriptada } = usuario

    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)

    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }

}

const getUsuario = async (email) => {
    const values = [email]
    const result = await pool.query("SELECT * FROM usuarios WHERE email= $1", values)
    const [usuario] = result.rows
    return usuario
}

module.exports = { registrarUsuario, verificarCredenciales, getUsuario }