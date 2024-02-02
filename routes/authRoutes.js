const express = require("express");

const router = express.Router();

router.post("/change-password", (req, res) => {
  
    res.send("Password change route");
});

router.post("/reset-password", (req, res) => {

    res.send("Password reset route");
});


router.put("/update-profile", (req, res) => {
    res.send("Update user profile route");
});

router.delete("/delete-account", (req, res) => {
    
    res.send("Delete user account route");
});


router.post("/refresh-token", (req, res) => {

    res.send("Refresh token route");
});

router.get("/",(req,res)=>{
    res.send("royal islamic bank server auth routes")
})


module.exports = router;