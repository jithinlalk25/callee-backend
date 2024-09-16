export class SendOtpDto {
  phoneNumber: string;
}

export class VerifyOtpDto {
  phoneNumber: string;
  otp: string;
}
