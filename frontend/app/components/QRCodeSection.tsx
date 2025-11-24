'use client';

import { useState, useEffect } from 'react';
import { generateCustomQR, downloadQRCode } from '@/lib/api';

interface QRCodeSectionProps {
  urlId: string;
  shortUrl: string;
  initialQRCode?: string;
  initialCustomizations?: {
    foregroundColor: string;
    backgroundColor: string;
    size: number;
  };
}

export default function QRCodeSection({
  urlId,
  shortUrl,
  initialQRCode,
  initialCustomizations
}: QRCodeSectionProps) {
  const [qrCode, setQrCode] = useState<string>(initialQRCode || '');
  const [size, setSize] = useState<number>(initialCustomizations?.size || 300);
  const [foregroundColor, setForegroundColor] = useState<string>(
    initialCustomizations?.foregroundColor || '#000000'
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    initialCustomizations?.backgroundColor || '#FFFFFF'
  );
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialQRCode) {
      setQrCode(initialQRCode);
    }
  }, [initialQRCode]);

  const handleRegenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await generateCustomQR({
        urlId,
        size,
        foregroundColor,
        backgroundColor,
        format
      });
      setQrCode(response.data.qrCode);
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadQRCode(urlId, format);
  };

  const applyPreset = (preset: 'default' | 'orange' | 'inverse') => {
    switch (preset) {
      case 'default':
        setForegroundColor('#000000');
        setBackgroundColor('#FFFFFF');
        break;
      case 'orange':
        setForegroundColor('#FF6B35');
        setBackgroundColor('#FFFFFF');
        break;
      case 'inverse':
        setForegroundColor('#FFFFFF');
        setBackgroundColor('#000000');
        break;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
      
      {/* QR Code Preview */}
      <div className="flex flex-col items-center mb-6">
        {qrCode ? (
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <img
              src={qrCode}
              alt="QR Code"
              className="w-[200px] h-[200px]"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </div>
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No QR Code</span>
          </div>
        )}
        <p className="text-sm text-gray-600 mt-2 font-mono">{shortUrl}</p>
      </div>

      {/* Color Presets */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Presets
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => applyPreset('default')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Black on White
          </button>
          <button
            onClick={() => applyPreset('orange')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            style={{ borderColor: '#FF6B35' }}
          >
            Dashdig Orange
          </button>
          <button
            onClick={() => applyPreset('inverse')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
          >
            White on Black
          </button>
        </div>
      </div>

      {/* Customization Controls */}
      <div className="space-y-4 mb-6">
        {/* Size Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size: {size}px
          </label>
          <input
            type="range"
            min="100"
            max="500"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100px</span>
            <span>500px</span>
          </div>
        </div>

        {/* Foreground Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foreground Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Format Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'png' | 'svg')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Generating...' : 'Regenerate'}
        </button>
        <button
          onClick={handleDownload}
          disabled={!qrCode}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Download {format.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

