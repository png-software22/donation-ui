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
  // Create a new window for printing
  const printWindow = window.open("", "", "height=600,width=800");

  // Write the complete HTML with styles
  printWindow.document.write(htmlString);
  printWindow.document.close();

  // Wait for content to load before printing (especially on Windows)
  printWindow.onload = () => {
    // Ensure styles are applied
    setTimeout(() => {
      printWindow.print();

      // Close window after print completes
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 250);
  };

  // Fallback if onload doesn't trigger
  setTimeout(() => {
    if (printWindow && !printWindow.closed) {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }
  }, 1000);
};
