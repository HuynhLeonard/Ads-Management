document.querySelector("#yes").addEventListener("click", checkRequirement);

function IsInvalidEmail(the_email) {
  var at = the_email.indexOf("@");
  var dot = the_email.lastIndexOf(".");
  var space = the_email.indexOf(" ");

  if (
    at != -1 && //có ký tự @
    at != 0 && //ký tự @ không nằm ở vị trí đầu
    dot != -1 && //có ký tự .
    dot > at + 1 &&
    dot < the_email.length - 1 && //phải có ký tự nằm giữa @ và . cuối cùng
    space == -1 //không có khoẳng trắng
  ) {
    return true;
  } else {
    return false;
  }
}

function checkRequirement() {
  const x = document.querySelector("#name").value;
  const y = document.querySelector("#email").value;
  const z = document.querySelector("#phone").value;
  const t = document.querySelector("#report").value;
  const u = document.querySelector("#captchaI").value;
  const v1 = document.querySelector("#formFileLg1").value;
  const v2 = document.querySelector("#formFileLg2").value;
  const message = document.querySelector(".message").value;

  //   const yes = "Captcha hợp lệ";
  const no = "Captcha không hợp lệ";

  let reName = document.getElementById("reName");
  let reEmail = document.getElementById("reEmail");
  let rePhone = document.getElementById("rePhone");
  let rePass = document.getElementById("rePort");
  let reCap = document.getElementById("reCap");
  let rePic1 = document.getElementById("rePic1");
  let rePic2 = document.getElementById("rePic2");

  reName.textContent = "*";
  reEmail.textContent = "*";
  rePhone.textContent = "*";
  rePass.textContent = "*";
  reCap.textContent = "* ";

  if (x.length === 0) {
    reName.textContent = "Hãy điền tên";
    document.querySelector("#name").select();
    return;
  }

  if (y.length === 0) {
    reEmail.textContent = "Hãy điền email";
    document.querySelector("#email").select();
    return;
  }

  if (!IsInvalidEmail(y)) {
    reEmail.textContent = "Email không hợp lệ";
    document.querySelector("#email").select();
    return;
  }

  if (z.length === 0) {
    rePhone.textContent = "Hãy điền số điện thoại";
    document.querySelector("#phone").select();
    return;
  }

  if (t.length === 0) {
    rePass.textContent = "Hãy viết nội dung báo cáo";
    document.querySelector("#psw").select();
    return;
  }

  if (v1.length === 0) {
    rePic1.textContent = "Hãy chọn 1 ảnh";
    document.querySelector("#formFileLg1").select();
    return;
  }

  if (v2.length === 0) {
    rePic2.textContent = "Hãy chọn 1 ảnh";
    document.querySelector("#formFileLg2").select();
    return;
  }

  if (u.length === 0) {
    reCap.textContent = "Hãy nhập captcha";
    document.querySelector("#captchaI").select();
    return;
  }

  if (message === no) {
    return;
  }

  alert("Cảm ơn vì đã đóng góp!");
}
