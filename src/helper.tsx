import html2pdf from "html2pdf.js";

export const generatePDF = (htmlString, filename = Date.now() + ".pdf") => {
  // Create temporary container
  const container = document.createElement("div");

  // Inject HTML string
  container.innerHTML = htmlString;

  html2pdf()
    .from(container)
    .set({
      margin: [2, 2],
      filename,
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    })
    .save();
};

export const printDocument = (htmlString) => {
  // Create temporary container
  const container = document.createElement("div");

  // Inject HTML string
  container.innerHTML = htmlString;

  // Create a new window for printing
  const printWindow = window.open("", "", "height=600,width=800");
  printWindow.document.write("<html><head><title>Print</title></head><body>");
  printWindow.document.write(container.innerHTML);
  printWindow.document.write("</body></html>");
  printWindow.document.close();

  // Close window after print completes
  printWindow.onafterprint = () => {
    printWindow.close();
  };

  // Trigger print dialog
  printWindow.print();
};
