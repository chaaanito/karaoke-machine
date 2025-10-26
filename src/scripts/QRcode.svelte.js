import QRCode from 'qrcode'
import { peer } from './Peer.svelte'

export const generateQRcode = async (node) => {
  try {
    node.src = await QRCode.toDataURL(`${window.location.href}#/${peer.machineId}`, { errorCorrectionLevel: 'L' })
    console.log(`${window.location.href}#/${peer.machineId}`)
  } catch (err) {
    console.error(err)
  }
}
