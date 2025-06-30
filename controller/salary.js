import cloudinary from 'cloudinary';
import PDFDocument from 'pdfkit';
import Employee from '../models/employee.js';
import Leave from '../models/leave.js';
import Salary from '../models/salary.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const processMonthlySalaries = async () => {
  try {
    const employees = await Employee.find();
    const currentDate = new Date();
    const salaryMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    for (const employee of employees) {
      const employeeId = employee.employeeId;
      const baseSalary = employee.salary || 5000; 

      const leaves = await Leave.find({
        employeeId,
        status: 'Approved',
        fromDate: { $gte: salaryMonth },
        toDate: { $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) },
      });

      let totalLeaveDays = 0;
      leaves.forEach(leave => {
        const from = new Date(leave.fromDate);
        const to = new Date(leave.toDate);
        totalLeaveDays += Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
      });

      const leaveDeduction = totalLeaveDays * (baseSalary / 30);
      const adjustedSalary = baseSalary - leaveDeduction;
      let salaryRecord = await Salary.findOne({ employeeId, salaryDate: salaryMonth });
      if (!salaryRecord) {
        salaryRecord = new Salary({ employeeId, amount: adjustedSalary, salaryDate: salaryMonth });
      } else {
        salaryRecord.amount = adjustedSalary;
      }

      await new Promise((resolve, reject) => {
        const pdfDoc = new PDFDocument();
        const buffers = [];

        pdfDoc.on('data', buffers.push.bind(buffers));
        pdfDoc.on('end', async () => {
          const pdfBuffer = Buffer.concat(buffers);

          try {
            const uploadResponse = await new Promise((res, rej) => {
              const uploadStream = cloudinary.v2.uploader.upload_stream(
                { resource_type: 'raw', public_id: `salary_report_${employeeId}_${salaryMonth.getFullYear()}-${salaryMonth.getMonth() + 1}` },
                (error, result) => {
                  if (error) rej(error);
                  else res(result);
                }
              );
              uploadStream.end(pdfBuffer);
            });

            salaryRecord.salaryScript = uploadResponse.secure_url;
            await salaryRecord.save();
            resolve(); 
          } catch (error) {
            console.error(`Error uploading PDF for Employee ${employeeId}:`, error);
            reject(error);
          }
        });

        pdfDoc.fontSize(14).text(`Employee ID: ${employeeId}`);
        pdfDoc.text(`Employee Name: ${employee.name}`);
        pdfDoc.text(`Designation: ${employee.designation}`);
        pdfDoc.text(`Base Salary: ${baseSalary}`);
        pdfDoc.text(`Total Leave Days: ${totalLeaveDays}`);
        pdfDoc.text(`Leave Deduction: ${leaveDeduction}`);
        pdfDoc.text(`Final Salary: ${adjustedSalary}`);
        pdfDoc.end();
      });
    }
    console.log('Monthly salary processing completed successfully.');
  } catch (error) {
    console.error('Error processing monthly salaries:', error);
  }
};
