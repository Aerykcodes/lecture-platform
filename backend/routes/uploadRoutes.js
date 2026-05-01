const express = require("express");
const router = express.Router();

const s3 = require("../config/s3");

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/signed-url", authMiddleware, async(req,res)=>{
  try{

    const { fileName, fileType, courseId } = req.body;

    const key = `courses/${courseId}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType
    });

    const uploadUrl = await getSignedUrl(s3,command,{
      expiresIn:60
    });

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ uploadUrl, fileUrl });

  }catch(err){
    console.log(err);
    res.status(500).json({message:"Error generating URL"});
  }
});

module.exports = router;