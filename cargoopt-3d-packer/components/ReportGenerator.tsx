'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw, Loader } from 'lucide-react';
import jsPDF from 'jspdf';

interface PlacedBlock {
  id: string;
  position: [number, number, number];
  size: number;
}

interface ReportGeneratorProps {
  flightInfo: {
    flightNumber: string;
    origin: string;
    destination: string;
    aircraftType: string;
    totalSpace: number;
    occupiedSpace: number;
  };
  placedBlocks: PlacedBlock[];
  totalLuggage: number;
  onReset: () => void;
}

export function ReportGenerator({
  flightInfo,
  placedBlocks,
  totalLuggage,
  onReset,
}: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate statistics
  const cargoLength = 20;
  const cargoWidth = 6;
  const cargoHeight = 2.5;
  const totalCargoSpace = cargoLength * cargoWidth * cargoHeight;
  const usedSpace = placedBlocks.reduce((sum, block) => sum + block.size ** 3, 0);
  const freeSpace = totalCargoSpace - usedSpace;
  const usedPercentage = (usedSpace / totalCargoSpace) * 100;
  const freePercentage = (freeSpace / totalCargoSpace) * 100;

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Set colors
      const primaryColor = [59, 130, 246]; // Blue
      const textColor = [0, 0, 0];
      const lightGray = [240, 240, 240];

      // Header
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, 40, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.text('CargoOpt', 20, 20);
      pdf.setFontSize(12);
      pdf.text('Cargo Loading Report', 20, 28);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.text(flightInfo.flightNumber, pageWidth - 40, 20);
      pdf.setFontSize(10);
      pdf.text(`${flightInfo.origin} → ${flightInfo.destination}`, pageWidth - 40, 28);

      yPosition = 50;

      // Flight Information Section
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFontSize(16);
      pdf.text('Flight Information', 20, yPosition);
      yPosition += 12;

      // Flight info boxes
      const boxWidth = (pageWidth - 50) / 2;
      const boxHeight = 20;

      // Box 1: Flight Number
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(20, yPosition, boxWidth, boxHeight, 'F');
      pdf.setFontSize(10);
      pdf.text('Flight Number', 25, yPosition + 6);
      pdf.setFontSize(14);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(flightInfo.flightNumber, 25, yPosition + 14);

      // Box 2: Aircraft Type
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(20 + boxWidth + 10, yPosition, boxWidth, boxHeight, 'F');
      pdf.setFontSize(10);
      pdf.text('Aircraft Type', 25 + boxWidth + 10, yPosition + 6);
      pdf.setFontSize(12);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(flightInfo.aircraftType, 25 + boxWidth + 10, yPosition + 14);

      yPosition += boxHeight + 8;

      // Box 3: Route
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(20, yPosition, boxWidth, boxHeight, 'F');
      pdf.setFontSize(10);
      pdf.text('Route', 25, yPosition + 6);
      pdf.setFontSize(12);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(`${flightInfo.origin} → ${flightInfo.destination}`, 25, yPosition + 14);

      // Box 4: Luggage Loaded
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(20 + boxWidth + 10, yPosition, boxWidth, boxHeight, 'F');
      pdf.setFontSize(10);
      pdf.text('Luggage Loaded', 25 + boxWidth + 10, yPosition + 6);
      pdf.setFontSize(12);
      pdf.setTextColor(16, 185, 129); // Green
      pdf.text(`${placedBlocks.length} / ${totalLuggage}`, 25 + boxWidth + 10, yPosition + 14);

      yPosition += boxHeight + 15;

      // Space Utilization Section
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFontSize(16);
      pdf.text('Space Utilization', 20, yPosition);
      yPosition += 12;

      // Statistics table
      const tableData = [
        ['Total Cargo Space', `${totalCargoSpace.toFixed(2)} m³`],
        ['Used Space', `${usedSpace.toFixed(2)} m³`],
        ['Free Space', `${freeSpace.toFixed(2)} m³`],
        ['Utilization Rate', `${usedPercentage.toFixed(1)}%`],
      ];

      pdf.setFontSize(11);
      tableData.forEach((row, index) => {
        const bgColor = index % 2 === 0 ? [245, 245, 245] : [255, 255, 255];
        pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        pdf.rect(20, yPosition, pageWidth - 40, 8, 'F');

        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(row[0], 25, yPosition + 5);

        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(row[1], pageWidth - 30, yPosition + 5, { align: 'right' });

        yPosition += 8;
      });

      yPosition += 10;

      // Luggage Details Section
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFontSize(16);
      pdf.text('Luggage Loaded', 20, yPosition);
      yPosition += 10;

      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(20, yPosition, pageWidth - 40, 15, 'F');
      pdf.setFontSize(11);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.text(`${placedBlocks.length} out of ${totalLuggage} bags successfully loaded`, 25, yPosition + 5);
      pdf.setFontSize(9);
      pdf.text('All passenger luggage has been optimally packed into the aircraft cargo hold.', 25, yPosition + 10);

      yPosition += 20;

      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      pdf.text('CargoOpt 3D Cargo Loading Manager', pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Save PDF
      pdf.save(`CargoOpt_Report_${flightInfo.flightNumber}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Main scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto p-8">
          {/* Report Content */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold">CargoOpt</h1>
                  <p className="text-blue-100 text-lg">Cargo Loading Report</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{flightInfo.flightNumber}</p>
                  <p className="text-blue-100">{flightInfo.origin} → {flightInfo.destination}</p>
                </div>
              </div>
            </div>

            {/* Flight Information */}
            <div className="p-8 border-b-4 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Flight Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="text-gray-600 font-semibold text-sm">Flight Number</p>
                  <p className="text-2xl font-bold text-blue-700">{flightInfo.flightNumber}</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg border-2 border-cyan-200">
                  <p className="text-gray-600 font-semibold text-sm">Aircraft Type</p>
                  <p className="text-2xl font-bold text-cyan-700">{flightInfo.aircraftType}</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border-2 border-teal-200">
                  <p className="text-gray-600 font-semibold text-sm">Route</p>
                  <p className="text-2xl font-bold text-teal-700">
                    {flightInfo.origin} → {flightInfo.destination}
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
                  <p className="text-gray-600 font-semibold text-sm">Luggage Loaded</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {placedBlocks.length} / {totalLuggage}
                  </p>
                </div>
              </div>
            </div>

            {/* Space Utilization */}
            <div className="p-8 border-b-4 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Space Utilization</h2>

              {/* Pie Chart Representation */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Used Space */}
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray={`${(usedPercentage / 100) * 282.7} 282.7`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-blue-600">{usedPercentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">Used</p>
                    </div>
                  </div>
                  <p className="text-center text-gray-700 font-semibold">
                    {usedSpace.toFixed(2)} m³ / {totalCargoSpace.toFixed(2)} m³
                  </p>
                </div>

                {/* Free Space */}
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeDasharray={`${(freePercentage / 100) * 282.7} 282.7`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-green-600">{freePercentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">Free</p>
                    </div>
                  </div>
                  <p className="text-center text-gray-700 font-semibold">
                    {freeSpace.toFixed(2)} m³ / {totalCargoSpace.toFixed(2)} m³
                  </p>
                </div>
              </div>

              {/* Statistics Table */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-blue-200">
                      <td className="py-3 font-semibold text-gray-700">Total Cargo Space</td>
                      <td className="py-3 text-right font-bold text-blue-700">
                        {totalCargoSpace.toFixed(2)} m³
                      </td>
                    </tr>
                    <tr className="border-b border-blue-200">
                      <td className="py-3 font-semibold text-gray-700">Used Space</td>
                      <td className="py-3 text-right font-bold text-blue-700">
                        {usedSpace.toFixed(2)} m³
                      </td>
                    </tr>
                    <tr className="border-b border-blue-200">
                      <td className="py-3 font-semibold text-gray-700">Free Space</td>
                      <td className="py-3 text-right font-bold text-green-700">
                        {freeSpace.toFixed(2)} m³
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-gray-700">Utilization Rate</td>
                      <td className="py-3 text-right font-bold text-blue-700">
                        {usedPercentage.toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Luggage Details */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Luggage Loaded</h2>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-lg font-bold text-gray-800">
                  {placedBlocks.length} out of {totalLuggage} bags successfully loaded
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  All passenger luggage has been optimally packed into the aircraft cargo hold.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-6 text-center border-t-4 border-blue-200">
              <p className="text-gray-600 text-sm">
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
              <p className="text-gray-500 text-xs mt-2">CargoOpt 3D Cargo Loading Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Buttons at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-blue-50 via-cyan-50 to-transparent pt-8 pb-6 px-8 flex gap-4 justify-center border-t-4 border-blue-200">
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 shadow-lg"
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download PDF Report
            </>
          )}
        </Button>

        <Button
          onClick={onReset}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          Load Another Flight
        </Button>
      </div>
    </div>
  );
}

export default ReportGenerator;
