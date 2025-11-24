'use client';

interface QRCodeTooltipProps {
  qrCode: string;
  shortUrl: string;
}

export default function QRCodeTooltip({ qrCode, shortUrl }: QRCodeTooltipProps) {
  if (!qrCode) return null;

  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <img
        src={qrCode}
        alt="QR Code"
        className="w-[100px] h-[100px]"
      />
      <p className="text-xs text-gray-600 mt-2 font-mono text-center max-w-[100px] truncate">
        {shortUrl}
      </p>
    </div>
  );
}

