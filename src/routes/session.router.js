import express from "express"
import userModel from "../Dao/models/userModel.js"

const router = express.Router()

router.post("/register", async (req, res) => {
    //Recibo info del form
    const {name, lastname, email, password} = req.body

    try {
        const existUser = await userModel.findOne({ email })

        if (existUser) {
            return res.status(401).send({status:"Error", error: "Cuenta ya asociada al email ingresado"})
        }


        let role = "user"
        
        await userModel.create({ name, lastname, email, password, role })

        res.status(200).send({status:"success", message: "Usuario creado correctamente"})

    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: `Error al crear el usuario error: ${error}`
        })
    }
})

router.post("/login", async (req, res) =>{
    const { email, password } = req.body
    try {
        let isAdmin = false
        let user
        if (email === "adminCoder@coder.com" && password === "adminCod3r123" ) {
            isAdmin = true
            user = {
                name: "Coder" ,
                lastname : "House" ,
                email: "adminCoder@coder.com",
                role: "admin",
                admin: isAdmin
            }
        } else {
            user = await userModel.findOne({ email, password})
        }
        if (!user) {
            return res.status(400).send({ status: "ERROR", message:"Email o contraseña erronea"})
        }

        req.session.user = {
            name : user.name ,
            lastname : user.lastname ,
            email: user.email,
            role: user.role,
            admin: isAdmin
        }

        res.status(200).send({
            status: "success" ,
            message : "Inicio de sesion exitoso"
        })

    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: `Error al obtener el usuario. Error: ${error}`,
          });
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.send({ status: "Error", message: `Error al borrar la sesion ${error}`})
        } else {
            res.status(200).send( { status: "Success", message: "Sesion eliminada con exito"})
        }
    })
})

export default router