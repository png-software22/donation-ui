import html2pdf from "html2pdf.js";

export const generatePDF = (htmlString, filename = Date.now() + ".pdf") => {
  // Create temporary container
  const container = document.createElement("div");

  // Inject HTML string
  container.innerHTML = htmlString;

  html2pdf()
    .from(container)
    .set({
      margin: [2,2],
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
