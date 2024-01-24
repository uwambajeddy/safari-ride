// import twilio from 'twilio';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);
// const serviceId='VAe30e4ec193961a98a1bb32530c65816d'

// export const smsVerificationCode = async (phoneNumber) => {

//  const result = await client.verify.v2.services(serviceId)
//   .verifications
//   .create({ to: `+${phoneNumber}`, channel: 'sms' });
 
//  console.log(result)


//  return {message:"good",ok:true};

// }

import textflow from "textflow.js";
textflow.useKey(process.env.TEXTFLOW_KEY);
export const smsVerificationCode = async (phoneNumber) => {

 const results = await textflow.sendVerificationSMS(phoneNumber);
 return results;

}