var express = require('express');
var router = express.Router();
const pool = require("../src/sql.js");
const path = require("path");
const multer = require('multer');
const fs = require('fs');
//新增使用者資訊到login table
router.post('/login', (req, res) => {

  console.log(req.body);

  //資料庫註冊
  pool.query(`insert into login (fname, lname, email, password) values ('${req.body.fname}','${req.body.lname}','${req.body.email}','${req.body.password}');`)
  res.send(200);
});

//登入資料核對
router.post('/signin', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  const query = 'SELECT * FROM login WHERE email = ?';

  pool.query(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      // 處理錯誤
      return;
    }

    // results 包含查詢結果的陣列
    const rows = results[0];
    console.log(rows);
    console.log(rows.email);

    if (rows.email === email && rows.password === password) { //驗證前端傳到後端的帳號密碼是否有存在於資料庫
      // 找到符合條件的使用者
      console.log('User found:', rows.fname + rows.lname);
      res.send("Success" + rows.fname + rows.lname);

    } else {
      // 沒有符合條件的使用者
      console.log('User not found');
      res.send("errr");
    }
  });
}
);

//將創建資料夾的資訊存入資料庫
router.post('/WCreateFolder', (req, res) => {
  console.log(req.body)

  if (req.body.token.includes("Success")) {
    const user = req.body.token.slice(7);//取得Success後面的字串 slice(輸入取用的第幾位之後)
    console.log(user)
    pool.query(`insert into CreateFolder (user, folder_name, uploadtime) values ('${user}','${req.body.data.folder_name}','${String(req.body.data.uploadtime)}');`)
    return res.sendStatus(200);
  }
  res.sendStatus(403);
});

//創建使用者上傳檔案之資料夾
router.post('/CreateFolder', (req, res) => {
  const folderName = req.body.name

  // 動態生成資料夾路徑
  const folderPath = path.join(__dirname, '..', 'UserUploadFolder', folderName);

  // 如果資料夾不存在，則建立
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(folderName)
    return res.send('Success'+folderName);
  }

  res.send('fail   ');
});

//刪除使用者上傳檔案之資料夾
router.delete('/DeleteFolder/:folderName', (req, res) => {
  const folderName = req.params.folderName;

  // 動態生成資料夾路徑
  const folderPath = path.join(__dirname, '..', 'UserUploadFolder', folderName);

  
  if (fs.existsSync(folderPath)) {
    // 使用 fs.rmdirSync 刪除資料夾
    fs.rmdirSync(folderPath, { recursive: true });

    return res.send('Success');
  }

  res.send("can't find");
});

//使用者上傳檔案至資料庫
router.post('/upload', (req, res) => {
  console.log(req.body)

  if (req.body.token.includes("Success") && req.body.folder.includes("Success")) {
    const folder = req.body.folder.slice(7);//取得Success後面的字串 slice(輸入取用的第幾位之後)
    const user = req.body.token.slice(7);
    console.log(user)
    console.log(folder)
    console.log(req.body.data.project_name)
    console.log(req.body.data.project_data)
    console.log(req.body.data.uploadtime)
    
    pool.query(`insert into Project (u0ser, folder, project_name, project_data, upload_time) values ('${user}', '${folder}', '${req.body.data.project_name}', '${req.body.data.project_data}', '${String(req.body.data.uploadtime)}');`)
    return res.sendStatus(200);
  }
  res.sendStatus(403);
});


module.exports = router;
