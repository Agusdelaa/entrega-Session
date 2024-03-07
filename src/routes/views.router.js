import express from "express"
import productController from "../Dao/controllers/productController.js";
import cartController from "../Dao/controllers/cartController.js";

const router = express.Router()

router.get("/products", async (req, res) => {
  if (!req.session?.user) {
    return res.redirect("/login")
  }  

  const user = req.session.user
  
  try {
        const {
            docs,
            totalPages,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            prevLink,
            nextLink 
        } = await productController.getProducts(req)
        //Creo arreglo de Productos
        const products = docs.map(product => {
            return {
                id: product._id.toString(),
                title: product.title,
                code: product.code,
                stock: product.stock,
                category: product.category,
                price: product.price ,
                status: product.status
            }
        })
        //El map lo hice ya q si pasaba DOCS en el render no lo mostraba!

        res.render('products.handlebars', {
            products,
            totalPages,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            prevLink,
            nextLink,
            user
        })

    } catch (error) {
        res.send({ status: "Error", error: error })
    }
})

// router.get("/carts/:cid", async (req, res) => {
//     try {
//         const cid = req.params.cid
//         const cart = await cartController.getCartById(cid)
//         console.log(cart)
//         cart.products = cart.products.map(product => {
//             return {
//                 ...product,
//                 total : product.price * product.quantity
//             }
//         })
//         // console.log("soy prueba", cart.products[0].price)
//         cart.total = cart.products.reduce((accum, product) => accum + product.total, 0)
//         console.log(cart.total)
//         // const mapedProducts = cart.products.map(product => {
//         //         return {
//         //             id: product._id.toString(),
//         //             quantity : product.quantity,
//         //             ...product
//         //         }
//         // })
//         // res.render("carts.handlebars", {
//         //     cart : {
//         //         _id : cart._id ,
//         //         quantity : mapedProducts.quantity, 
//         //         products: mapedProducts ,
//         //         total : cart.total
//         //     }
//         // })
//         //console.log(cart)
//         res.render("carts.handlebars", {
//             cart
//         })

//     } catch (error) {
//         res.send({ status: "Error", error: error })
//         console.log(error)
//     }
// })

router.get("/carts/:cid", (req, res) => {
    const cid = req.params.cid;
    fetch(`http://localhost:8080/api/carts/${cid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const products = data.payload.products;
          res.render("carts.handlebars", { products, title: "Carrito" });
        } else {
          res.status(500).send("Error al obtener el carrito");
        }
      })
      .catch((error) =>
        res.status(500).send(`Error en el fetch de carrito. ${error}`)
      );
  });

router.get("/login", (req, res) => {
    res.render("login.handlebars", {title: "Login"})
})

router.get("/register", (req, res) => {
    res.render("register.handlebars", {title: "Register"})
})


export default  router