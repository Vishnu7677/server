const express = require("express");
const Form60Details = require("../models/form60");
const router = express.Router();

//creating update form 60 user details

router.post("/", async (req, res) => {
    try {
      const newform60Userdetails = new Form60Details(req.body);
      await newform60Userdetails.save();
  
      return res.status(200).json({ message: "Update form60 user details created...!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  //Getting All update form 60 user details
  router.get("/alluserdetails", async (req, res) => {
    try {
      const form60Userdetails = await Form60Details.find();
      res.json(form60Userdetails);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  //Getting single update form 60 user details
  router.get('/userdetails/:id', async (req, res) => {
    try {
      const form60Userdetails = await Form60Details.findById(req.params.id);
      if (!form60Userdetails) {
        return res.status(404).send({ message: 'User Details Not Found' });
      }
      res.send(form60Userdetails);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
  });
 //Delete the product
 router.delete("/userdetails/:id", async (req, res) => {
    try {
        const form60Userdetails = await Form60Details.findByIdAndDelete(req.params.id);
        if (!form60Userdetails) {
          return res.status(404).send({ message: 'User Details Not Found' });
        }
        res.send({ message: 'User Details deleted successfully' });
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error ...!" });
      }
  });

module.exports = router