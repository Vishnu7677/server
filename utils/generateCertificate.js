// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");

// const generateCertificate = async ({ userDetails, interestPeriod, startDate, endDate }) => {
//   // Create the directory if it doesn't exist
//   const certificatesDir = path.join(__dirname, "..", "certificates");
//   if (!fs.existsSync(certificatesDir)) {
//     fs.mkdirSync(certificatesDir);
//   }

//   // Create a new PDF document
//   const doc = new PDFDocument();
//   // Customize the PDF content based on the provided parameters and userDetails
//   // ...

//   // Save the PDF to a file or upload to a storage service
//   const certificatePath = path.join(certificatesDir, `${userDetails.userAccountNumber}_certificate.pdf`);
//   const stream = fs.createWriteStream(certificatePath);
//   doc.pipe(stream);
//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => {
//       resolve(certificatePath); // Return the path or URL where the generated certificate is saved
//     });

//     stream.on("error", (error) => {
//       reject(error);
//     });
//   });
// };

// module.exports = generateCertificate;


// module.exports = ({userId, accountHolderName, bankBranchName, userAccountNumber, 
//   userAccountType, accountHolderAddress, interestPeriod, startDate, endDate})=>{
//   const today = new Date();
//   return `
//   <!doctype html>
//   <html>
//   <head>
//   <litle>Interest PDF</litle>
//   <style>
  
//   </style>

//   </head>
//   <body>
//   <div>
//   <table cellpadding="0" cellspacing="0">
//   <tr class="top">
//   <td colspan="2">
//   <table>
//   <tr>
//   <td> 
//   <p> ${accountHolderName}</p>
//   <p>${accountHolderAddress}</p>
//   </td>
//   <td>
//   Your Base Branch: ${bankBranchName}
//   </td>
//   <td>
//   Date: ${`${today.getdate()}.${today.getMonth() + 1}.${today.getFullYear()}. `}
//   </td>
//   </tr>
  
//   </table>
//   </td>
//   </tr>
//   <p>Interest Certificate</p>
//   <p>Dear,</p>
//   <p>Please find below confirmation of the Interest paid and Tax withheld/Tax Deducted at Source/Interest Collected towards
//   various Deposit/Loan accounts held under Cust ID : ${userId} for the period ${startDate}, ${endDate} or ${interestPeriod}</p>
//   <tr class="information">
//   <td colspan="2">
//   <tabel>
//   <tr>
//   <td>
  
//   Type of Account: ${userAccountType}
//   </td>

//   </tr>
  
//   </tabel>
//   </td>
  
//   </tr>
//   <tr class="heading">
//   <td>S.No</td>
//   <td>Account No</td>
//   <td>nterest Paid (Amt. in INR) </td>
//   <td>Tax Withheld/ Tax deducted at
//   source/ Interest Collected (Amt.
//   in INR)</td>
//   </tr>
//   <tr>
//   <td>1</td>
//   </tr>

//   <tr class="item">
//   <td>${userAccountNumber}</td>
  
//   </tr>

//   <tr class="item">
//   <td>54</td>
  
//   </tr>
//   <tr class="item">
//   <td>76</td>
  
//   </tr>

//   </table>
//   <br/>
//   <h4 class="justify-center">Total: ${parseInt(54) + parseInt(76)}$</h4>
//   </div>
  
//   </body>
  
//   </html>
  
//   `
// }

 {/* {certificateDownloadUrl && (  
             <div id="pdfContent" >
              <div>
                <table cellpadding="0" cellspacing="0">
                  <tr class="top">
                    <td colspan="2">
                      <table>
                        <tr>
                          <td>
                            <p>Account Type: Saving </p>
                            <p>Account Number: 12445642</p>
                          </td>
                          <td>Your Base Branch: gudur</td>
                          <td></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <p>Interest Certificate</p>
                  <p>Dear,</p>
                  <p>
                    Please find below confirmation of the Interest paid and Tax
                    withheld/Tax Deducted at Source/Interest Collected towards
                    various Deposit/Loan accounts held under Cust ID : 947364763
                    for the period June 12 2019 to Agust 12 2019.
                  </p>
                  <tr class="information">
                    <td colspan="2">
                      <tabel>
                        <tr>
                          <td></td>
                        </tr>
                      </tabel>
                    </td>
                  </tr>
                  <tr class="heading">
                    <td>S.No</td>
                    <td>Account No</td>
                    <td>nterest Paid (Amt. in INR) </td>
                    <td>
                      Tax Withheld/ Tax deducted at source/ Interest Collected
                      (Amt. in INR)
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                  </tr>

                  <tr class="item">43547832</tr>

                  <tr class="item">
                    <td>54</td>
                  </tr>
                  <tr class="item">
                    <td>76</td>
                  </tr>
                </table>
                <br />
                <h4 class="justify-center">
                  Total: ${parseInt(54) + parseInt(76)}
                </h4>
              </div>
            </div>
            )} */}



            // const handledownload = async (event) => {
            //   event.preventDefault();
            
            //   if (!selectedAccount) {
            //     console.error("Please select an account number");
            //     return;
            //   }
            
            //   const isInterestPeriodSelected = document.getElementById("interestPeriod").checked;
            
            //   let startDate, endDate;
            
            //   if (isInterestPeriodSelected) {
            //     // If Interest Period is selected, use the selected start and end dates
            //     if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            //       console.error("Invalid date selected");
            //       return;
            //     }
            //   } else {
            //     // If Financial Year is selected, calculate start and end dates based on the selected year
            //     if (selectedYear) {
            //       // Assuming selectedYear is in the format "FY YYYY-YYYY"
            //       const [startYear, endYear] = selectedYear
            //         .substring(3) // Extract years part
            //         .split("-") // Split into start and end years
            //         .map((year) => parseInt(year));
            
            //       // Set start date to April 1 of the start year
            //       startDate = new Date(${startYear}-04-01);
            
            //       // Set end date to March 31 of the end year
            //       endDate = new Date(${endYear + 1}-03-31);
            //     } else {
            //       console.error("Invalid financial year selected");
            //       return;
            //     }
            //   }
            
            //   try {
            //     const values = await calculateValues();
            //     const { interestPaid, taxWithheld } = values;
            
            //     // ... (rest of the code remains unchanged)
            
            //   } catch (error) {
            //     console.error("Error generating certificate:", error);
            //   }
            // };