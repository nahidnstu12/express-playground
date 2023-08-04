import {
  emailConfirmationBody,
  phoneVerificationOTPBody,
  transporter,
} from "./mailer.js";

export const registerMailService = async (data) => {
  const { username, userEmail, link, type, otp } = data;
  try {
    if (type === 1) {
      await transporter.sendMail(
        emailConfirmationBody({ username, userEmail, link }),
      );
    } else if (type === 2) {
      await transporter.sendMail(
        phoneVerificationOTPBody({ username, userEmail, otp }),
      );
    }

    return { msg: "You have been received email from our service." };
  } catch (err) {}
  // body of the email
};

export const generateOTPService = async ({ userId }) => {
  try {
    // should check phone validate
    const OTP = generateRandomSixDigitNumber();
    // const user = await UserModel.findOneAndUpdate(
    //   { _id: userId, is_mobile_verified: 0 },
    //   { otp: OTP },
    //   { new: true },
    // );
    //
    // if (!user) {
    //   return { msg: "User already mobile verified." };
    // }

    // req.app.locals.OTP = OTP; // need to better solution
    console.log("Phone verification otp--", OTP);
    return {
      msg: "OTP sent successfully",
      code: OTP,
    };
  } catch (err) {
    return { msg: err };
  }
};

export function generateRandomSixDigitNumber() {
  const min = 100000; // Minimum 6-digit number (100000)
  const max = 999999; // Maximum 6-digit number (999999)

  // Generate a random number between min and max (inclusive)
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  // Convert the number to a string
  let numberString = randomNumber.toString();

  // Split the string into an array of characters
  let numberArray = numberString.split("");

  // Shuffle the array using Fisher-Yates (Knuth) shuffle algorithm
  for (let i = numberArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numberArray[i], numberArray[j]] = [numberArray[j], numberArray[i]];
  }

  // Join the shuffled array back into a string
  return numberArray.join("");
}
