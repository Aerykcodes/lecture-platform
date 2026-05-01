const express = require("express");
const router = express.Router();

const TutorProfile = require("../models/TutorProfile");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// =============================
// CREATE / UPDATE PROFILE
// =============================
router.post(
  "/setup",
  authMiddleware,
  roleMiddleware("tutor"),
  async (req,res)=>{
    try{

      console.log("Saving profile for:", req.user.id);

      const profile = await TutorProfile.findOneAndUpdate(
        { tutorId:req.user.id },
        { ...req.body, tutorId:req.user.id },
        { upsert:true, new:true }
      );

      res.json(profile);

    }catch(err){
      console.log(err);
      res.status(500).json({message:"Server error"});
    }
  }
);


// =============================
// GET MY PROFILE
// =============================
router.get(
  "/me",
  authMiddleware,
  roleMiddleware("tutor"),
  async (req,res)=>{
    try{

      console.log("Fetching profile for:", req.user.id);

      const profile = await TutorProfile.findOne({
        tutorId:req.user.id
      });

      if(!profile){
        return res.status(404).json({
          message:"Profile not found"
        });
      }

      res.json(profile);

    }catch(err){
      console.log(err);
      res.status(500).json({
        message:"Server error"
      });
    }
  }
);


// =============================
// PUBLIC PROFILE
// =============================
router.get("/public/:subdomain", async(req,res)=>{
  try{

    const tutor = await TutorProfile.findOne({
      subdomain:req.params.subdomain
    });

    if(!tutor){
      return res.status(404).json({
        message:"Tutor not found"
      });
    }

    res.json(tutor);

  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"Server error"
    });
  }
});

module.exports = router;