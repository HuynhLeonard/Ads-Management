const dropArea = document.getElementById('drop-area')
const inputImage = document.getElementById('input-image')
let imgView = document.getElementById('img-view')
const badgeText = document.getElementById('badge-text')

const initImgView = imgView.innerHTML;

const uploadImage = () => {
  const files = inputImage.files
  if (files.length > 2) {
    alert('Chỉ được chọn tối đa 2 ảnh')
    return
  }
  let imgLinks = []
  // loop through files
  for (let i = 0; i < files.length; i++) {
    // create object URL to use as src for img element
    imgLinks.push(URL.createObjectURL(files[i]))
  }
  // console.log(`url(${imgLinks[0]})`)

  badgeText.textContent = files.length.toString()
  // remove hidden attribute from badgeText's parent element when files.length > 0
  if (files.length > 0) {
    badgeText.parentElement.removeAttribute('hidden')
    imgView.style.backgroundImage = `url(${imgLinks[0]})`
    imgView.style.minHeight = '16rem'
    imgView.textContent = ''
    imgView.style.border = 'none'
  } else {
    badgeText.parentElement.setAttribute('hidden', '')
    // reset imgView
    imgView.style.backgroundImage = ''
    imgView.style.border = '2px dashed #bbb5ff'
    imgView.innerHTML = initImgView
  }
}

inputImage.addEventListener('change', uploadImage)
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault()
})
dropArea.addEventListener('drop', (e) => {
  e.preventDefault()
  inputImage.files = e.dataTransfer.files
  uploadImage()
})
