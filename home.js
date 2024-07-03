const fs = require('fs');

fs.mkdir('Home',(err)=>{
    console.log(err);
})
console.log(fs);