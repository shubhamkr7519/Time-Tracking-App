// src/services/emailService.js (Enhanced with real email sending)
const crypto = require('crypto');
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Initialize email transporter only if email credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // This should be an App Password, not your regular password
        }
      });
      
      // Verify transporter configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email configuration error:', error);
        } else {
          console.log('✅ Email service ready');
        }
      });
    } else {
      console.log('📧 Email service running in development mode (console logging only)');
    }
  }

  async sendEmployeeInvitation(email, verificationToken, userId) {
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${userId}/${verificationToken}`;
    
    // Always log to console for debugging
    console.log('=== EMPLOYEE INVITATION EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Welcome to Insightful - Verify Your Account`);
    console.log(`Verification Link: ${verificationLink}`);
    console.log(`Token: ${verificationToken}`);
    console.log('=====================================');

    // Send real email if transporter is configured
    if (this.transporter) {
      try {
        const mailOptions = {
          from: `"Insightful" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Welcome to Insightful - Verify Your Account',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to Insightful!</h1>
                <p style="color: #6b7280; font-size: 16px;">Time Tracking & Productivity Platform</p>
              </div>
              
              <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
                <h2 style="color: #111827; margin-bottom: 16px;">You've been invited!</h2>
                <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                  You've been invited to join the Insightful time tracking platform. 
                  Please verify your email address to set up your account and get started.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationLink}" 
                     style="background-color: #2563eb; color: white; padding: 14px 28px; 
                            text-decoration: none; border-radius: 8px; display: inline-block;
                            font-weight: 600; font-size: 16px;">
                    Verify Email & Set Up Account
                  </a>
                </div>
              </div>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>Alternative:</strong> If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="word-break: break-all; background-color: #fffbeb; padding: 10px; border-radius: 4px; 
                          margin: 10px 0 0 0; font-family: monospace; font-size: 12px; color: #92400e;">
                  ${verificationLink}
                </p>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                  This invitation link will expire in 24 hours.
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  If you didn't expect this invitation, please ignore this email.
                </p>
              </div>
            </div>
          `
        };

        await this.transporter.sendMail(mailOptions);
        console.log(`✅ Real invitation email sent to ${email}`);
        
        return {
          success: true,
          message: 'Invitation email sent successfully'
        };
      } catch (error) {
        console.error('❌ Failed to send invitation email:', error);
        return {
          success: false,
          message: 'Failed to send email. Link logged to console for development.',
          error: error.message
        };
      }
    }
    
    return {
      success: true,
      message: 'Invitation email logged to console (development mode)'
    };
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    // Always log to console for debugging
    console.log('=== PASSWORD RESET EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your Password - Insightful`);
    console.log(`Reset Link: ${resetLink}`);
    console.log(`Token: ${resetToken}`);
    console.log('=============================');

    // Send real email if transporter is configured
    if (this.transporter) {
      try {
        const mailOptions = {
          from: `"Insightful" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Reset Your Password - Insightful',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin-bottom: 10px;">Password Reset</h1>
                <p style="color: #6b7280; font-size: 16px;">Insightful Time Tracking</p>
              </div>
              
              <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
                <h2 style="color: #111827; margin-bottom: 16px;">Reset Your Password</h2>
                <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                  We received a request to reset your password. Click the button below to create a new password.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" 
                     style="background-color: #dc2626; color: white; padding: 14px 28px; 
                            text-decoration: none; border-radius: 8px; display: inline-block;
                            font-weight: 600; font-size: 16px;">
                    Reset Password
                  </a>
                </div>
              </div>
              
              <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="color: #991b1b; margin: 0; font-size: 14px;">
                  <strong>Security Note:</strong> This link will expire in 15 minutes for your security.
                </p>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                  If you didn't request this password reset, please ignore this email.
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  Your password will remain unchanged.
                </p>
              </div>
            </div>
          `
        };

        await this.transporter.sendMail(mailOptions);
        console.log(`✅ Real password reset email sent to ${email}`);
        
        return {
          success: true,
          message: 'Password reset email sent successfully'
        };
      } catch (error) {
        console.error('❌ Failed to send password reset email:', error);
        return {
          success: false,
          message: 'Failed to send email. Link logged to console for development.',
          error: error.message
        };
      }
    }
    
    return {
      success: true,
      message: 'Password reset email logged to console (development mode)'
    };
  }

  async sendWelcomeEmail(email, name) {
    // Always log to console for debugging
    console.log('=== WELCOME EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Welcome to Insightful, ${name}!`);
    console.log(`Message: Your account has been verified. You can now download the desktop app.`);
    console.log('======================');

    // Send real email if transporter is configured
    if (this.transporter) {
      try {
        const mailOptions = {
          from: `"Insightful" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
          to: email,
          subject: `Welcome to Insightful, ${name}!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to Insightful!</h1>
                <p style="color: #6b7280; font-size: 16px;">Your account is now active</p>
              </div>
              
              <div style="background-color: #d1fae5; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                <h2 style="color: #065f46; margin-bottom: 16px;">Account Verified Successfully!</h2>
                <p style="color: #047857; line-height: 1.6;">
                  Hello ${name}, your email has been verified and your account is now active. 
                  You can now download the desktop application to start tracking your time.
                </p>
              </div>
              
              <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
                <h3 style="color: #111827; margin-bottom: 16px;">Next Steps:</h3>
                <ol style="color: #374151; line-height: 1.8; padding-left: 20px;">
                  <li>Log in to your account at <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: #2563eb;">Insightful</a></li>
                  <li>Download the desktop application</li>
                  <li>Start tracking your time and productivity</li>
                  <li>Generate detailed reports</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                   style="background-color: #2563eb; color: white; padding: 14px 28px; 
                          text-decoration: none; border-radius: 8px; display: inline-block;
                          font-weight: 600; font-size: 16px;">
                  Access Your Account
                </a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  If you need help getting started, please contact your administrator.
                </p>
              </div>
            </div>
          `
        };

        await this.transporter.sendMail(mailOptions);
        console.log(`✅ Real welcome email sent to ${email}`);
        
        return {
          success: true,
          message: 'Welcome email sent successfully'
        };
      } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
        return {
          success: false,
          message: 'Failed to send email. Message logged to console for development.',
          error: error.message
        };
      }
    }
    
    return {
      success: true,
      message: 'Welcome email logged to console (development mode)'
    };
  }
}

module.exports = new EmailService();
