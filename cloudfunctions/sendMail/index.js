const cloud = require('wx-server-sdk')
const nodemailer = require('nodemailer')
const { OrderError, parseOrder, buildMail } = require('./mail')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// Configure these in the cloud function's environment variables, never in code.
const { SMTP_HOST = 'smtp.qq.com', SMTP_PORT = '465', SMTP_USER, SMTP_PASS, MAIL_TO } = process.env

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
})

// Photos go in as attachments: temporary download links expire before
// staff get round to old mails.
async function attachPhotos(fileIDs) {
  const attachments = []
  const missing = []
  await Promise.all(fileIDs.map(async (fileID, i) => {
    try {
      const { fileContent } = await cloud.downloadFile({ fileID })
      const ext = (fileID.match(/\.(jpe?g|png|gif|webp|heic)$/i) || ['.jpg'])[0].toLowerCase()
      attachments[i] = { filename: `photo-${i + 1}${ext}`, content: fileContent }
    } catch (e) {
      missing.push(fileID)
    }
  }))
  return { attachments: attachments.filter(Boolean), missing }
}

exports.main = async (event) => {
  if (!SMTP_USER || !SMTP_PASS || !MAIL_TO) {
    return { ok: false, error: 'SMTP_USER, SMTP_PASS and MAIL_TO must be set on the sendMail cloud function' }
  }
  let order
  try {
    order = parseOrder(event)
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message }
    throw e
  }
  const { attachments, missing } = await attachPhotos(order.imageFileID)
  const mail = buildMail(order, { from: `MBB小程序 <${SMTP_USER}>`, to: MAIL_TO }, missing)
  const info = await transporter.sendMail({ ...mail, attachments })
  return { ok: true, messageId: info.messageId }
}
