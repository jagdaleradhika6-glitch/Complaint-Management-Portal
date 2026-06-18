import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const exportComplaintsToExcel = (complaints) => {
  const data = complaints.map((item) => ({
    Title: item.title,
    Description: item.description,
    Category: item.category,
    Priority: item.priority,
    Status: item.status,
    Department: item.department,
    Date: new Date(item.complaintDate).toLocaleDateString(),
    Student: item.user?.name || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Complaints');
  XLSX.writeFile(workbook, 'complaints.xlsx');
};

export const exportComplaintsToPDF = (complaints) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Complaint Report', 14, 20);
  doc.setFontSize(10);
  let y = 30;

  complaints.forEach((item, index) => {
    const line = `${index + 1}. ${item.title} | ${item.category} | ${item.status} | ${item.priority}`;
    doc.text(line, 14, y);
    y += 8;
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save('complaints.pdf');
};
