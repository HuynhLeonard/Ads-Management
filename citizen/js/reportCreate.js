import {
  upload2Imgur, uploadReport, getReportTypes
} from '/js/request.js';

const urlParams = new URLSearchParams(window.location.search);
const objectID = urlParams.get('id');
// console.log(objectID)
$('#object-id').val(objectID);

const reportTypes = await getReportTypes();
// console.log(reportTypes);
const reportTypeSelect = document.getElementById('report-type');
// remove all options
reportTypeSelect.innerHTML = '';
reportTypeSelect.innerHTML = '<option selected>Chọn 1 loại hình báo cáo</option>';
reportTypes.forEach((type) => {
  const option = document.createElement('option');
  option.value = type.typeID;
  option.innerText = type.typeName;
  reportTypeSelect.appendChild(option);
})

const alertPlaceholder = document.getElementById('alertConfirm')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  alertPlaceholder.append(wrapper)
}

const submitHandler = async (e) => {
  e.preventDefault();
  grecaptcha.execute('6LeRPU0pAAAAAO3wpsQevQMPg0qP6GyEZzAQ_0MU', { action: 'submit' }).then(async (token) => {
    if (!document.getElementById('sender-name').value || !document.getElementById('phone').value || !document.getElementById('email').value) {
      alert('Bạn phải nhập đầy đủ thông tin người báo cáo');
      return;
    }
    if (!reportTypeSelect.value) {
      alert('Bạn phải chọn loại hình báo cáo');
      return;
    }
    const inputImage = document.getElementById('input-image');
    const files = inputImage.files;
    if (files.length > 2){
      alert('Chỉ được chọn tối đa 2 ảnh');
      return;
    }
    if (files.length > 0 && !tinymce.activeEditor.getContent()) {
      alert('Bạn phải nhập thông tin báo cáo');
      return;
    }
    let imgUrls = [];
    if (files.length > 0) {
      imgUrls = await upload2Imgur(files);
      console.log(imgUrls);
    }

    const data = {
      objectID: objectID,
      reportImages: imgUrls,
      reportType: reportTypeSelect.value,
      reporterName: document.getElementById('sender-name').value,
      reporterPhone: document.getElementById('phone').value,
      reporterEmail: document.getElementById('email').value,
      reportInfo: tinymce.activeEditor.getContent(),
    }
    // console.log('Will send data', data);

    let reportID = null;
    try {
      reportID = await uploadReport(data, token);
      // append the reportID to the local storage
      const reportIDs = localStorage.getItem('reportIDs');
      if (reportIDs) {
        localStorage.setItem('reportIDs', `${reportIDs},${reportID}`);
      } else {
        localStorage.setItem('reportIDs', `${reportID}`);
      }
      console.log(reportID);
      appendAlert('Báo cáo thành công', 'success');
    } catch (err) {
      console.log(err);
      // alert('Báo cáo thất bại');
      appendAlert('Báo cáo thất bại', 'danger');
    }
  });

}
const cancelHandler = (e) => {
  console.log('cancel');
  e.preventDefault();

  // ask the user to confirm
  const isConfirmed = confirm('Bạn có chắc chắn muốn huỷ?');
  if (!isConfirmed) return;

  window.history.back();
}

document.getElementById('submitBtn').addEventListener('click', submitHandler);
document.getElementById('cancelBtn').addEventListener('click', cancelHandler);
