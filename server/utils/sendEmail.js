const transporter = require("./emailConfig");

const sendAbsenceEmail = async (to, studentName, className, date) => {
  try {
    await transporter.sendMail({
      from: '"School Attendance System" <hello@git.com>',
      to: to,
      subject: `Absence Notification for ${studentName}`,
      text: `Dear Guardian,\n\nThis is to inform you that ${studentName} was marked absent for ${className} on ${date}.\n\nPlease contact the school for any clarifications.\n\nBest regards,\nSchool Administration`,
      html: `<p>Dear Guardian,</p><p>This is to inform you that <strong>${studentName}</strong> was marked absent for <strong>${className}</strong> on <strong>${date}</strong>.</p><p>Please contact the school for any clarifications.</p><p>Best regards,<br>School Administration</p>`,
    });
    console.log(`Absence email sent to ${to}`);
  } catch (error) {
    console.error("Error sending absence email:", error);
  }
};

module.exports = { sendAbsenceEmail };
