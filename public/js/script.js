

function generatepass() {
 
  document.getElementById("myBtn").addEventListener("click", function () {

    var x = document.getElementById("myDIV");
    var length = 8;
    var password = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#?!@$%^&*-";
    var newpassword = '';
    for (var i = 0, n = password.length; i < length; ++i) {
      newpassword += password.charAt(Math.floor(Math.random() * n));
    }
    x.innerHTML = newpassword
  });
}