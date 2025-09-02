// hash.js
const bcrypt = require("bcrypt");

const password = "Renan@2004";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Erro ao gerar hash:", err);
    return;
  }
  console.log("Hash gerado:", hash);
});
