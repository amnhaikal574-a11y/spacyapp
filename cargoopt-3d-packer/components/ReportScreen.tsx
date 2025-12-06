'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, BarChart3, Plane, ArrowRight, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportScreenProps {
  flight: any;
  totalLuggage: number;
  placedLuggage: number;
  totalSpace: number;
  occupiedSpace: number;
  freeSpace: number;
  onBackToInput: () => void;
}

export function ReportScreen({
  flight,
  totalLuggage,
  placedLuggage,
  totalSpace,
  occupiedSpace,
  freeSpace,
  onBackToInput,
}: ReportScreenProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const usedPercentage = (placedLuggage / totalLuggage) * 100;
  const spaceUsedPercentage = ((occupiedSpace + (totalLuggage * 0.0895)) / totalSpace) * 100;
  const spaceFreePercentage = 100 - spaceUsedPercentage;

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById('report-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save(`CargoOpt_Report_${flight['Flight Number']}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 p-4 py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-yellow-300/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Cargo Loading Complete! 🎉</h1>
          <p className="text-white/90 text-lg">Flight {flight['Flight Number']} - Loading Report</p>
        </div>

        {/* Report Content */}
        <div id="report-content" className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          {/* Flight Info */}
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Plane className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Flight Information</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold">Flight Number</p>
                <p className="text-xl font-bold text-blue-600">{flight['Flight Number']}</p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold">Route</p>
                <p className="text-lg font-bold text-cyan-600">
                  {flight['Origin']} <ArrowRight className="w-4 h-4 inline" /> {flight['Destination']}
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold">Aircraft</p>
                <p className="text-lg font-bold text-teal-600">{flight['Aircraft Type']}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold">Date</p>
                <p className="text-lg font-bold text-purple-600">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Luggage Statistics */}
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Luggage Statistics</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <p className="text-sm text-gray-600 font-semibold mb-2">Bags Loaded</p>
                <p className="text-4xl font-bold text-green-600">{placedLuggage}</p>
                <p className="text-xs text-gray-500 mt-2">of {totalLuggage} total</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <p className="text-sm text-gray-600 font-semibold mb-2">Loading Rate</p>
                <p className="text-4xl font-bold text-blue-600">{usedPercentage.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-2">Luggage loaded</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg text-center">
                <p className="text-sm text-gray-600 font-semibold mb-2">Remaining</p>
                <p className="text-4xl font-bold text-orange-600">{totalLuggage - placedLuggage}</p>
                <p className="text-xs text-gray-500 mt-2">bags to load</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
                style={{ width: `${usedPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Space Utilization */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
              Space Utilization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart Representation */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    {/* Used space */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${(spaceUsedPercentage / 100) * 282.7} 282.7`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-blue-600">{spaceUsedPercentage.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Used</p>
                  </div>
                </div>
              </div>

              {/* Space Details */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 font-semibold">Total Capacity</p>
                  <p className="text-2xl font-bold text-blue-600">{totalSpace.toFixed(2)} m³</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 font-semibold">Space Used</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(occupiedSpace + placedLuggage * 0.0895).toFixed(2)} m³
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="text-sm text-gray-600 font-semibold">Free Space</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {(totalSpace - (occupiedSpace + placedLuggage * 0.0895)).toFixed(2)} m³
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-blue-600">Summary:</span> Successfully loaded{' '}
              <span className="font-bold">{placedLuggage}</span> out of{' '}
              <span className="font-bold">{totalLuggage}</span> passenger bags into the cargo hold. The aircraft is
              utilizing <span className="font-bold text-blue-600">{spaceUsedPercentage.toFixed(1)}%</span> of its total
              cargo capacity with <span className="font-bold text-orange-600">{spaceFreePercentage.toFixed(1)}%</span>{' '}
              remaining free space.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            {isGeneratingPDF ? 'Generating PDF...' : 'Download Report'}
          </Button>
          <Button
            onClick={onBackToInput}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg"
          >
            Load Next Flight
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportScreen;
