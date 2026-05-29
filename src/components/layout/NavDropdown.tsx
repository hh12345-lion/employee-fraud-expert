"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface NavDropdownProps {
  label: string;
  href: string;
  items: { href: string; label: string }[];
  onNavigate?: () => void;
}

export function NavDropdown({ label, href, items, onNavigate }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex min-h-[44px] items-center">
        <Link
          href={href}
          className="rounded-l px-2 py-2 text-sm text-body transition-colors hover:bg-section-alt hover:text-primary"
          onClick={() => {
            setOpen(false);
            onNavigate?.();
          }}
        >
          {label}
        </Link>
        <button
          type="button"
          className="flex min-h-[44px] min-w-[32px] items-center justify-center rounded-r py-2 pr-1 text-body transition-colors hover:bg-section-alt"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={`${label} menu`}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-0 min-w-[240px] max-w-[min(340px,calc(100vw-2rem))] rounded-[8px] border border-border bg-white py-2 shadow-lg">
          <ul className="max-h-[min(70vh,24rem)] overflow-y-auto overscroll-contain">
            {items.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block px-4 py-2.5 text-sm text-body transition-colors hover:bg-section-alt hover:text-primary"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
