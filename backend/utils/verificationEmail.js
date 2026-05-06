export default function verificationEmail(verificationCode) {
  return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!-- Preconnect for better performance -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <!-- Link to Oxanium and Roboto fonts -->
            <link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@200..800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
              /* Fallback fonts */
              body {
                font-family: 'Oxanium', 'Roboto', sans-serif !important;
                margin: 0;
                padding: 0;
                background-color: #0c0c0c;
              }
              
              h1, h2, p {
                font-family: 'Oxanium', 'Roboto', sans-serif !important;
              }
  
              h1 {
                color: #ffffff;
                margin: 0;
                font-size: 32px;
                font-weight: 600;
              }
  
              h2 {
                color: #ff4e1d;
                font-size: 48px;
                font-weight: semibold;
                margin: 0;
                letter-spacing: 3px;
              }
  
              p {
                color: #cccccc;
                font-size: 16px;
                margin-top: 20px;

              }
  
              table {
                width: 100%;
                background-color: #0c0c0c;
                padding: 250px 0;
              }
  
              .card {
                width: 600px;
                background-color: #202020;
                border-radius: 0px;
                padding: 50px;
              }
            </style>
          </head>
          <body>
            <!-- Wrapper Table for Centering -->
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <!-- Card Table -->
                  <table role="presentation" class="card" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <h1>WELCOME TO POUND-AK!</h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 30px;">
                        <p>Use the code below to verify your email.</p>
                        <h2>
                          ${verificationCode}
                        </h2>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
}
