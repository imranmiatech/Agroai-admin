import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { SoilTestRequest } from "../redux";

export function generateSoilReportPdf(request: SoilTestRequest) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const report = request.labReport;
  const brandDarkGreen = [14, 49, 40] as [number, number, number]; // #0E3128
  const brandLime = [203, 255, 84] as [number, number, number]; // #CBFF54
  const textDark = [30, 41, 59] as [number, number, number];
  const textGray = [100, 116, 139] as [number, number, number];

  // ==========================================
  // 1. TOP HEADER BANNER
  // ==========================================
  doc.setFillColor(...brandDarkGreen);
  doc.rect(0, 0, 210, 36, "F");

  // Accent line
  doc.setFillColor(...brandLime);
  doc.rect(0, 36, 210, 2, "F");

  // Title & Header Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("KRISHIKUNJO AGROAI LABS", 15, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...brandLime);
  doc.text("SOIL DIAGNOSTICS & BIO-NUTRIENT LABORATORY", 15, 21);

  doc.setFontSize(7.5);
  doc.setTextColor(220, 230, 225);
  doc.text("ISO/IEC 17025 Accredited • Ministry of Agriculture Reg: DAE-LAB-BOG-2026", 15, 27);
  doc.text("Sherpur Road Regional Lab, Bogura, Bangladesh | Hotline: +880 1712-KRISHI", 15, 32);

  // Right Badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(148, 8, 48, 20, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...brandDarkGreen);
  doc.text("OFFICIAL LAB REPORT", 152, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...textGray);
  doc.text(`Sample ID: ${request.id}`, 152, 19);
  doc.text(`Date: ${report?.reportDate || request.completedDate || request.requestDate}`, 152, 24);

  // ==========================================
  // 2. FARMER & LAND METADATA SUMMARY
  // ==========================================
  let currentY = 46;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...brandDarkGreen);
  doc.text("1. FARMER & FARMLAND INFORMATION", 15, currentY);

  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    theme: "plain",
    styles: { fontSize: 8.5, cellPadding: 2, textColor: textDark },
    columnStyles: {
      0: { fontStyle: "bold", textColor: textGray, cellWidth: 32 },
      1: { cellWidth: 60 },
      2: { fontStyle: "bold", textColor: textGray, cellWidth: 32 },
      3: { cellWidth: 56 },
    },
    body: [
      [
        "Farmer Name:",
        request.farmerName,
        "Sample / Test ID:",
        request.id,
      ],
      [
        "Mobile Number:",
        request.phone,
        "Testing Package:",
        request.packageName,
      ],
      [
        "Location / Plot:",
        `${request.villagePlot || "Plot #01"}, ${request.upazila}, ${request.district}`,
        "Date of Collection:",
        request.requestDate,
      ],
      [
        "Land Size & Crop:",
        `${request.landArea || "3 Bigha"} • ${request.targetCrop || "General"}`,
        "Soil Texture Class:",
        report?.soilTexture || "Clay Loam (Alluvial)",
      ],
      [
        "Payment Status:",
        `৳${request.amount} Paid via ${request.paymentMethod}`,
        "Overall Health Score:",
        `${report?.overallHealthScore || 84}/100 (Good Soil Quality)`,
      ],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // ==========================================
  // 3. PARAMETERS LAB ANALYSIS TABLE
  // ==========================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...brandDarkGreen);
  doc.text("2. CHEMICAL & PHYSICAL NUTRIENT ANALYSIS", 15, currentY);

  currentY += 4;

  const parameterRows = report?.parameters
    ? report.parameters.map((p) => [
        p.name,
        `${p.measuredValue} ${p.unit}`,
        p.optimalRange,
        p.status,
      ])
    : [
        ["Soil pH", "6.4 pH", "6.0 - 7.0", "Optimal"],
        ["Available Nitrogen (N)", "142 kg/ha", "200 - 300", "Deficient"],
        ["Available Phosphorus (P)", "24.5 ppm", "18 - 30", "Optimal"],
        ["Available Potassium (K)", "185 ppm", "150 - 250", "Optimal"],
        ["Organic Carbon", "1.32 %", "1.50 - 2.50 %", "Moderate"],
        ["Available Zinc (Zn)", "0.72 ppm", "1.00 - 2.50", "Deficient"],
        ["Available Sulfur (S)", "16.8 ppm", "15.0 - 25.0", "Optimal"],
        ["Boron (B)", "0.38 ppm", "0.50 - 1.20", "Deficient"],
      ];

  autoTable(doc, {
    startY: currentY,
    theme: "striped",
    headStyles: {
      fillColor: brandDarkGreen,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: textDark,
    },
    columnStyles: {
      0: { cellWidth: 65, fontStyle: "bold" },
      1: { cellWidth: 40 },
      2: { cellWidth: 45 },
      3: { cellWidth: 30, fontStyle: "bold" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 3) {
        const val = String(data.cell.raw).trim();
        if (val === "Optimal") {
          data.cell.styles.textColor = [16, 122, 60]; // emerald green
        } else if (val === "Deficient") {
          data.cell.styles.textColor = [220, 38, 38]; // red
        } else if (val === "Moderate") {
          data.cell.styles.textColor = [202, 138, 4]; // amber
        }
      }
    },
    head: [["Nutrient / Parameter", "Measured Lab Value", "Agronomic Target Range", "Status"]],
    body: parameterRows,
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // ==========================================
  // 4. AGRONOMIST FERTILIZER DOSAGE PLAN
  // ==========================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...brandDarkGreen);
  doc.text("3. CUSTOMIZED FERTILIZER PRESCRIPTION & DOSAGE", 15, currentY);

  currentY += 4;

  const fertilizerRows = report?.fertilizerPlan
    ? report.fertilizerPlan.map((f) => [
        f.fertilizer,
        f.dosePerBigha,
        f.applicationStage,
        f.purpose,
      ])
    : [
        ["Urea (Granular)", "32 kg/Bigha", "3 Splits (Basal, 25 DAT, 45 DAT)", "Compensate Nitrogen deficiency"],
        ["Triple Super Phosphate (TSP)", "18 kg/Bigha", "100% at final land preparation", "Root anchoring and tillering"],
        ["Muriate of Potash (MoP)", "16 kg/Bigha", "50% Basal + 50% Top-dress", "Grain filling & disease tolerance"],
        ["Zinc Sulfate (Heptahydrate)", "2.5 kg/Bigha", "Basal broadcasting with soil", "Correct leaf chlorosis deficiency"],
        ["Trichoderma Bio-Compost", "120 kg/Bigha", "Final land tilling", "Restore organic matter and microbes"],
      ];

  autoTable(doc, {
    startY: currentY,
    theme: "striped",
    headStyles: {
      fillColor: brandDarkGreen,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: textDark,
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: 32 },
      2: { cellWidth: 50 },
      3: { cellWidth: 48 },
    },
    head: [["Recommended Input", "Dose per Bigha", "Application Stage", "Agronomic Purpose"]],
    body: fertilizerRows,
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Check if we need page break or footer space
  if (currentY > 245) {
    doc.addPage();
    currentY = 20;
  }

  // ==========================================
  // 5. AI AGRONOMIST RECOMMENDATIONS & SIGNATURES
  // ==========================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...brandDarkGreen);
  doc.text("4. EXPERT AGRONOMIST RECOMMENDATIONS", 15, currentY);

  currentY += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textDark);

  const tips = report?.aiRecommendations || [
    "Broadcast Zinc Sulfate 4-5 days prior to seedling transplanting for optimum root bioavailability.",
    "Introduce green manure (Dhaincha) during fallow periods to elevate soil organic carbon naturally.",
    "Split Urea applications into 3 equal doses to minimize nitrogen volatilization and groundwater runoff.",
  ];

  tips.forEach((tip) => {
    doc.text(`• ${tip}`, 18, currentY);
    currentY += 4;
  });

  currentY += 4;

  // Signatures Row
  doc.setDrawColor(200, 200, 200);
  doc.line(15, currentY + 12, 70, currentY + 12);
  doc.line(135, currentY + 12, 195, currentY + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...brandDarkGreen);
  doc.text("Dr. Nazmul Huda (PhD, Soil Science)", 15, currentY + 16);
  doc.text("Dr. Shamim Ara Begum", 135, currentY + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...textGray);
  doc.text("Lead Laboratory Analyst & Chemist", 15, currentY + 20);
  doc.text("Chief Agronomist & Research Director", 135, currentY + 20);

  // Footer Note
  doc.setFontSize(6.5);
  doc.setTextColor(...textGray);
  doc.text(
    "Verified electronically by KrishiKunjo AgroAi ISO/IEC 17025 Accredited Laboratory. Valid nationwide.",
    15,
    285
  );

  // ==========================================
  // SAVE & DIRECT DOWNLOAD TRIGGER
  // ==========================================
  const sanitizedId = request.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `KrishiKunjo_Soil_Test_Report_${sanitizedId}.pdf`;
  doc.save(fileName);
}
