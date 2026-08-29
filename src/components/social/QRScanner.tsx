"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { BrutalModal } from "../ui/BrutalModal";
import { BrutalButton } from "../ui/BrutalButton";

type QRScannerProps = {
  open: boolean;
  onClose: () => void;
  onScan: (payload: string) => void;
};

export function QRScanner({ open, onClose, onScan }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      scannedRef.current = false;
      return;
    }

    let mounted = true;

    async function startScanner() {
      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (!scannedRef.current) {
              scannedRef.current = true;
              scanner.stop().catch(() => {});
              onScan(decodedText);
            }
          },
          () => {}
        );
      } catch {
        if (mounted) {
          setManualMode(true);
          setError("Camera unavailable — use demo scan instead");
        }
      }
    }

    if (!manualMode) {
      startScanner();
    }

    return () => {
      mounted = false;
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [open, manualMode, onScan]);

  const demoUsers = [
    { label: "Scan Arjun", payload: "meetmint:arjun" },
    { label: "Scan Riya", payload: "meetmint:riya" },
    { label: "Scan Dev", payload: "meetmint:dev" },
  ];

  return (
    <BrutalModal open={open} onClose={onClose} title="Scan to Meet">
      <div className="space-y-4">
        {!manualMode && (
          <div id="qr-reader" className="w-full rounded-xl overflow-hidden brutal-border" />
        )}
        {error && <p className="text-sm font-bold text-orange">{error}</p>}
        <div className="space-y-2">
          <p className="text-xs font-black uppercase text-black/50">Demo Scan</p>
          {demoUsers.map((u) => (
            <BrutalButton
              key={u.payload}
              variant="ghost"
              className="w-full"
              onClick={() => onScan(u.payload)}
            >
              {u.label}
            </BrutalButton>
          ))}
        </div>
      </div>
    </BrutalModal>
  );
}
