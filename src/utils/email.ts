import nodemailer, { Transporter, TransportOptions } from "nodemailer";

export default class Email {
  newTransport(): Transporter {
    // if (process.env.NODE_ENV === "production") {
    //   return nodemailer.createTransport({
    //     service: "SendGrid",
    //     auth: {
    //       user: process.env.SENDGRID_USERNAME,
    //       pass: process.env.SENDGRID_PASSWORD,
    //     },
    //   });
    // }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    } as TransportOptions);
  }
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const msg = { from: process.env.EMAIL_FORM, to, subject, text };
    await this.newTransport().sendMail(msg);
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = "Reset password";
    const resetPasswordUrl = `${process.env.URL_LOCAL_HOST}/v1/auth/reset-password?token=${token}`;
    const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
    await this.sendEmail(to, subject, text);
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const subject = "Email Verification";
    const verificationEmailUrl = `${process.env.URL_LOCAL_HOST}/v1/auth/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    await this.sendEmail(to, subject, text);
  }
}
