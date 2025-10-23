import QRCode from 'qrcode'

export const generateQRcode = async (node) => {
  try {
    node.src = await QRCode.toDataURL(`${window.location.href}#/`, { errorCorrectionLevel: 'L' })
  } catch (err) {
    console.error(err)
  }
}
