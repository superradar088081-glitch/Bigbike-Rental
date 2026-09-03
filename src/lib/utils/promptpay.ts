/**
 * Standard Thai PromptPay QR Payload Generator (EMVCo Specification)
 */
export function generatePromptPayPayload(target: string, amount?: number): string {
  // Clean phone / id
  const cleanTarget = target.replace(/[^0-9]/g, '');
  let formattedTarget = cleanTarget;
  let targetType = '01'; // Phone default

  if (cleanTarget.length === 10) {
    // Mobile number: prefix with 0066 and trim leading 0
    formattedTarget = '0066' + cleanTarget.substring(1);
    targetType = '01';
  } else if (cleanTarget.length === 13) {
    // National ID or Tax ID
    formattedTarget = cleanTarget;
    targetType = '02';
  }

  const tag29_00 = '0016A000000677010111';
  const tag29_target = targetType + ('00' + formattedTarget.length).slice(-2) + formattedTarget;
  const tag29_value = tag29_00 + tag29_target;
  const tag29 = '29' + ('00' + tag29_value.length).slice(-2) + tag29_value;

  let raw = '000201010212' + tag29 + '5303764'; // 764 = THB currency code

  if (amount && amount > 0) {
    const formattedAmount = amount.toFixed(2);
    raw += '54' + ('00' + formattedAmount.length).slice(-2) + formattedAmount;
  }

  raw += '5802TH6304';

  const crc = calculateCRC16(raw);
  return raw + crc;
}

function calculateCRC16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }
  let hex = (crc & 0xffff).toString(16).toUpperCase();
  while (hex.length < 4) hex = '0' + hex;
  return hex;
}

/**
 * Returns QR Code Data Image URL
 */
export function getPromptPayQrImageUrl(promptpayNumber: string = '0812345678', amount?: number): string {
  const payload = generatePromptPayPayload(promptpayNumber, amount);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}&margin=10`;
}
