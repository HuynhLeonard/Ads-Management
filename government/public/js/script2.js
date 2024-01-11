document.querySelector("#Syes").addEventListener("click", checkRequirement);

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
  const editorData = editor.getData();
  let rePort = document.getElementById("reSport");
  rePort.textContent = "*";

  const x = document.querySelector("#Sname").value;
  const y = document.querySelector("#Semail").value;
  const z = document.querySelector("#Sphone").value;
  const u = document.querySelector("#ScaptchaI").value;
  const v1 = document.querySelector("#formFileLg1").value;
  const v2 = document.querySelector("#formFileLg2").value;
  const message = document.querySelector(".Smessage").value;

  //   const yes = "Captcha hợp lệ";
  const no = "Captcha không hợp lệ";

  let reName = document.getElementById("reSName");
  let reEmail = document.getElementById("reSEmail");
  let rePhone = document.getElementById("reSPhone");
  let reCap = document.getElementById("reSCap");
  let rePic1 = document.getElementById("rePic1");
  let rePic2 = document.getElementById("rePic2");

  reName.textContent = "*";
  reEmail.textContent = "*";
  rePhone.textContent = "*";
  reCap.textContent = "* ";

  if (x.length === 0) {
    reName.textContent = "Hãy điền tên";
    document.querySelector("#Sname").select();
    return;
  }

  if (y.length === 0) {
    reEmail.textContent = "Hãy điền email";
    document.querySelector("#Semail").select();
    return;
  }

  if (!IsInvalidEmail(y)) {
    reEmail.textContent = "Email không hợp lệ";
    document.querySelector("#Semail").select();
    return;
  }

  if (z.length === 0) {
    rePhone.textContent = "Hãy điền số điện thoại";
    document.querySelector("#Sphone").select();
    return;
  }

  if (editorData.length === 0) {
    rePort.textContent = "Hãy viết nội dung báo cáo";
    // document.querySelector(".ck-editor__main").select();
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
    document.querySelector("#ScaptchaI").select();
    return;
  }

  if (message === no) {
    return;
  }

  alert("Cảm ơn vì đã đóng góp!");
}
