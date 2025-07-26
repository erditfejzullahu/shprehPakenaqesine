export const verifyEmailTemplate = (verificationUrl: string) => `
<!DOCTYPE html>
<html lang="sq">
  <head>
    <meta charset="UTF-8" />
    <title>Verifikimi i Email-it</title>
    <style>
      body {
        font-family: Poppins, sans-serif;
        background-color: #f9fafb;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        -moz-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      h1 {
        font-size: 24px;
        color: #111827;
      }
      p {
        font-size: 16px;
        color: #4b5563;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        margin-top: 24px;
        padding: 12px 24px;
        background-color: #4f46e5;
        color: #ffffff!important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #9ca3af;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Mirë se vini!</h1>
      <p>
        Faleminderit që u regjistruat. Për të përfunduar regjistrimin dhe për të verifikuar adresën tuaj të email-it,
        ju lutemi klikoni butonin më poshtë:
      </p>
      <a href="${verificationUrl}" class="button" style="color:#fff!important">Verifiko Email-in</a>
      <p>
        Nëse nuk keni krijuar një llogari, ju mund ta injoroni këtë email.
      </p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Shfaqpakënaqësinë. Të gjitha të drejtat e rezervuara.
      </div>
    </div>
  </body>
</html>
`
