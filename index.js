const Express = require("express")
const jwt = require("jsonwebtoken")
const llave = require("./middleware/llaveSecreta")
const Verificacion = require("./middleware/verificacion")
var cors = require('cors')

const VerificarAdministrador = require("./middleware/verfiricarAdministrador")

const app = Express()
app.use(cors())
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Probando seguridad")
})

app.post("/autenticacion", (req, res) => {
    if ((req.body.usuario == "administrador" || req.body.usuario == "usuario") && req.body.clave == "123456") {

        var rol = "EL rol autenticado es Administrador";
        if (req.body.usuario != "administrador") {
            rol = "El rol autenticado es Usuario";
        }

        var datosToken = {
            autenticado: true,
            email: "demo1@gmail.com",
            nombre: "Pedro Rivas"
        }
        const token = jwt.sign(datosToken, llave.llavesecreta, {
            expiresIn: '1d'
        })

        res.json({
            mensaje: "Usuario autenticado",
            rol: rol,
            token: token
        })

    } else {
        res.status(404).send({ mensaje: "usuario no encontrado" })
    }
})



//ruta con autenticación
app.get("/seguro", Verificacion, (req, res) => {

    res.send("Informacion ultrasecreta")

})

app.get("/miperfil", Verificacion, (req, res) => {

    res.send("Informacion de mi perfil")

})


app.get("/soloadministrador", [VerificarAdministrador, Verificacion], (req, res) => {

    res.send("Esta informacion puede ser consultada solo por el administrador")

})


app.listen(3000, () => console.log("Escuchando en el puerto 3000"))