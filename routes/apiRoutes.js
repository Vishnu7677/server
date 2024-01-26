const express = require("express");

const router = express.Router();


router.get("/",(req,res)=>{
    res.send("royal islamic bank server api routes")
})

module.exports = router;