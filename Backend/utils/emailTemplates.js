/**
 * Premium, Theme-Consistent HTML Email Templates for Saylani Bootcamp LMS
 * Optimized for Gmail, Apple Mail, Outlook, and mobile email clients.
 */

const baseEmailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saylani Bootcamp LMS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0;">
          
          <!-- Header with Gradient & Branding -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%); padding: 36px 30px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <!-- Brand Badge -->
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 12px; padding: 8px 16px; margin-bottom: 12px;">
                      <span style="color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                        Saylani Bootcamp LMS
                      </span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                      SMIT Learning Portal
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 30px 32px; background-color: #ffffff;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: 500;">
                Saylani Mass IT Training (SMIT) • Bootcamp LMS
              </p>
              <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 11px;">
                Need assistance? Contact support at <a href="mailto:education@saylaniwelfare.com" style="color: #2563eb; text-decoration: none;">education@saylaniwelfare.com</a>
              </p>
              <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                © ${new Date().getFullYear()} Saylani Welfare International Trust. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * 1. Password Reset Email Template
 */
export const getPasswordResetEmailHtml = ({
  firstName = "User",
  resetLink,
  expireTime = "1 hour",
}) => {
  const content = `
    <!-- Greeting & Title -->
    <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
      Password Reset Request
    </h2>
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
      Hello <strong style="color: #0f172a;">${firstName}</strong>,
    </p>
    <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6;">
      We received a request to reset your password for your <strong>Saylani Bootcamp LMS</strong> account. Click the button below to choose a new password:
    </p>

    <!-- Prominent CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <a href="${resetLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 10px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); text-align: center;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <!-- Direct Link Fallback Box -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin: 24px 0 20px 0;">
      <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px; font-weight: 600;">
        Button not working? Copy and paste this link into your browser:
      </p>
      <p style="margin: 0; word-break: break-all;">
        <a href="${resetLink}" target="_blank" style="color: #2563eb; font-size: 12px; text-decoration: underline;">
          ${resetLink}
        </a>
      </p>
    </div>

    <!-- Security Alert Box -->
    <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; padding: 14px 16px; margin: 20px 0 10px 0;">
      <p style="margin: 0 0 4px 0; color: #1e40af; font-size: 13px; font-weight: 700;">
        🔒 Security Notice
      </p>
      <p style="margin: 0; color: #3b82f6; font-size: 12px; line-height: 1.5;">
        This reset link will expire in <strong>${expireTime}</strong>. If you didn't request a password reset, please ignore this email or contact support if you suspect unauthorized access.
      </p>
    </div>
  `;

  return baseEmailWrapper(content);
};

/**
 * 2. Account Password Setup Email Template (Link based)
 */
export const getAccountSetupEmailHtml = ({
  firstName = "Student",
  setupLink,
  expireTime = "7 days",
}) => {
  const content = `
    <!-- Greeting & Title -->
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
        Welcome to SMIT Bootcamp
      </span>
    </div>
    
    <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 700; text-align: center;">
      Set Up Your Portal Password
    </h2>
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
      Hello <strong style="color: #0f172a;">${firstName}</strong>, your account has been registered on the <strong>Saylani Bootcamp LMS</strong> portal.
    </p>
    <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
      Please click the button below to set up your password and access your dashboard:
    </p>

    <!-- Setup CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <a href="${setupLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 10px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); text-align: center;">
            Set Up My Password
          </a>
        </td>
      </tr>
    </table>

    <!-- Direct Link Fallback Box -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin: 24px 0 20px 0;">
      <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px; font-weight: 600;">
        Button not working? Copy and paste this link into your browser:
      </p>
      <p style="margin: 0; word-break: break-all;">
        <a href="${setupLink}" target="_blank" style="color: #2563eb; font-size: 12px; text-decoration: underline;">
          ${setupLink}
        </a>
      </p>
    </div>

    <!-- Expiration Alert -->
    <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; padding: 12px 16px; margin: 16px 0;">
      <p style="margin: 0; color: #1e40af; font-size: 12px; line-height: 1.5;">
        ⏳ <strong>Note:</strong> This setup link is valid for <strong>${expireTime}</strong>.
      </p>
    </div>
  `;

  return baseEmailWrapper(content);
};

/**
 * 3. Student Welcome & Credentials Email Template
 */
export const getWelcomeAccountEmailHtml = ({
  firstName = "Student",
  email,
  password,
  loginLink,
}) => {
  const content = `
    <!-- Greeting & Title -->
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
        Welcome to SMIT Bootcamp
      </span>
    </div>
    
    <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 700; text-align: center;">
      Your Student Portal Account is Ready!
    </h2>
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
      Hello <strong style="color: #0f172a;">${firstName}</strong>, welcome to Saylani Bootcamp LMS. Your student account has been successfully created.
    </p>

    <!-- Credentials Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 14px 0; color: #1e293b; font-size: 14px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
        🔑 Your Login Credentials
      </h3>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px; width: 30%;">
            <strong>Email:</strong>
          </td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 13px; font-weight: 600;">
            ${email}
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px;">
            <strong>Password:</strong>
          </td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 13px; font-weight: 600;">
            <code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${password}</code>
          </td>
        </tr>
      </table>
    </div>

    <!-- Login CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a href="${loginLink || "http://localhost:5173/login"}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 10px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); text-align: center;">
            Log In to Portal
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 12px 16px; margin: 16px 0;">
      <p style="margin: 0; color: #92400e; font-size: 12px; line-height: 1.5;">
        💡 <strong>Tip:</strong> For your security, please change your temporary password immediately upon your first login from your profile settings.
      </p>
    </div>
  `;

  return baseEmailWrapper(content);
};

/**
 * 4. Staff / Admin Welcome & Credentials Email Template
 */
export const getAdminWelcomeEmailHtml = ({
  firstName = "Admin",
  email,
  password,
  role = "Administrator",
  loginLink,
}) => {
  const content = `
    <!-- Greeting & Title -->
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="display: inline-block; background-color: #ede9fe; color: #6d28d9; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
        Staff Onboarding • ${role}
      </span>
    </div>
    
    <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 700; text-align: center;">
      Welcome to the Management Team!
    </h2>
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
      Hello <strong style="color: #0f172a;">${firstName}</strong>, you have been added as an <strong>${role}</strong> on Saylani Bootcamp LMS.
    </p>

    <!-- Credentials Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 14px 0; color: #1e293b; font-size: 14px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
        🛡️ Management Login Credentials
      </h3>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px; width: 30%;">
            <strong>Role:</strong>
          </td>
          <td style="padding: 6px 0; color: #2563eb; font-size: 13px; font-weight: 700;">
            ${role}
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px;">
            <strong>Email:</strong>
          </td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 13px; font-weight: 600;">
            ${email}
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px;">
            <strong>Password:</strong>
          </td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 13px; font-weight: 600;">
            <code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${password}</code>
          </td>
        </tr>
      </table>
    </div>

    <!-- Login CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a href="${loginLink || "http://localhost:5173/login"}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 10px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35); text-align: center;">
            Access Admin Dashboard
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; padding: 12px 16px; margin: 16px 0;">
      <p style="margin: 0; color: #1e40af; font-size: 12px; line-height: 1.5;">
        🔒 <strong>Security Policy:</strong> Please update your password immediately upon your first login from your profile settings.
      </p>
    </div>
  `;

  return baseEmailWrapper(content);
};
