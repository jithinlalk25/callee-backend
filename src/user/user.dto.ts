export class UpdateExpoPushTokenDto {
  expoPushToken: string;
}

export class SendEmailOtpDto {
  email: string;
}

export class VerifyEmailOtpDto {
  email: string;
  otp: string;
}

export class AddNameDto {
  name: string;
}
