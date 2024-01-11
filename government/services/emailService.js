import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }

  sendNewPassword(userEmail, newPassword) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Mật khẩu cho tài khoản mới',
      text: `Xin chào,\n\nMật khẩu của bạn đã khởi tạo thành công. Mật khẩu mới của bạn là: ${newPassword}.\n\nTrân trọng,\nTH Group`,
      html: `<p>Chào bạn,</p><p>Mật khẩu của bạn đã được khởi tạo thành công. Mật khẩu mới của bạn là: <strong>${newPassword}</strong></p>.<p>Trân trọng,<br>TH Group</p>`
    }

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  }

  sendOTP(userEmail, otp) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Mã OTP - Đổi mật khẩu',
      text: `Chào bạn,\n\nMã OTP để đổi mật khẩu của bạn là: ${otp}. Vui lòng sử dụng mã OTP trong khoảng thời gian 2 phút.\n\nTrân trọng,\nTH Group`,
      html: `<p>Chào bạn,</p><p>Mã OTP của bạn là: <strong>${otp}</strong>. Vui lòng sử dụng mã OTP này để thay đổi mật khẩu.</p><p>Trân trọng,<br>TH Group</p>`
    }

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  }

  sendReportSolution(emailData){
    const mailOptions = {
      from: process.env.EMAIL,
      to: emailData.reporterEmail,
      subject: 'PHẢN HỒI BÁO CÁO VI PHẠM CỦA NGƯỜI DÂN',
    }

    if(emailData.officer.ward == ''){
      mailOptions.text = `Xin chào ${emailData.reporterName},\n\nChúng tôi là cán bộ quản lý đại diện của QUẬN ${emailData.officer.district}\n\n
      Đầu tiên xin cảm ơn bạn vì đã gửi phản hồi, báo cáo của mình về vi phạm cho chúng tôi. Sau khi xem xét, chúng tôi xin được đưa ra biện pháp xử lí như sau:\n
      ${emailData.solution}.\n\nNếu có bất kì thắc mắc nào, xin hãy phản hồi tin này cho chúng tôi.\n\nTrân trọng,\nTH Group`,
      mailOptions.html = `<p>Xin chào <strong>${emailData.reporterName}</strong>,</p><p>Chúng tôi là cán bộ quản lý đại diện của QUẬN <strong>${emailData.officer.district}</strong></p><p>
      Đầu tiên xin cảm ơn bạn vì đã gửi phản hồi, báo cáo của mình về vi phạm cho chúng tôi. Sau khi xem xét, chúng tôi xin được đưa ra biện pháp xử lí như sau:</p><p>
      ${emailData.solution}.</p><p>Nếu có bất kì thắc mắc nào, xin hãy phản hồi tin này cho chúng tôi.</p><p>Trân trọng,<br>TH Group</p>`
    } else {
      mailOptions.text = `Xin chào ${emailData.reporterName},\n\nChúng tôi là cán bộ quản lý đại diện của PHƯỜNG ${emailData.officer.ward}, QUẬN ${emailData.officer.district}\n\n
      Đầu tiên xin cảm ơn bạn vì đã gửi phản hồi, báo cáo của mình về vi phạm cho chúng tôi. Sau khi xem xét, chúng tôi xin được đưa ra biện pháp xử lí như sau:\n
      ${emailData.solution}.\n\nNếu có bất kì thắc mắc nào, xin hãy phản hồi tin này cho chúng tôi.\n\nTrân trọng,\nTH Group`,
      mailOptions.html = `<p>Xin chào <strong>${emailData.reporterName}</strong>,</p><p>Chúng tôi là cán bộ quản lý đại diện của PHƯỜNG <strong>${emailData.officer.ward}</strong>, QUẬN <strong>${emailData.officer.district}</strong></p><p>
      Đầu tiên xin cảm ơn bạn vì đã gửi phản hồi, báo cáo của mình về vi phạm cho chúng tôi. Sau khi xem xét, chúng tôi xin được đưa ra biện pháp xử lí như sau:</p><p>
      <strong>${emailData.solution}</strong>.</p><p>Nếu có bất kì thắc mắc nào, xin hãy phản hồi tin này cho chúng tôi.</p><p>Trân trọng,<br>TH Group</p>`
    }

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  }
}

export default new EmailService();
