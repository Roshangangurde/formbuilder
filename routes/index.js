const express = require('express');
const router = express.Router();

router.get("/form",(req,res) =>{
    res.send('Hello from Form Builder');
});

module.exports = router;