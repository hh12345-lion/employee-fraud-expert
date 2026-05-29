"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SITE_EMAIL } from "@/lib/site";

const audienceOptions = [
  "Employer / HR / Finance",
  "Solicitor / Law Firm",
  "Insurer",
  "Other",
];

const fraudTypes = [
  "Embezzlement",
  "Payroll / Ghost Employees",
  "Expense Fraud",
  "Invoice / Supplier Fraud",
  "Procurement Fraud",
  "Director Misconduct",
  "Data / IP Theft",
  "Bribery / Corruption",
  "FTPF-related",
  "Unknown / Not Sure",
];

const proceedingsOptions = [
  "No proceedings yet - just discovered",
  "Civil fraud recovery",
  "Criminal proceedings",
  "POCA confiscation",
  "Employment tribunal",
  "Regulatory investigation",
  "Other",
];

const lossValues = [
  "Unknown yet",
  "Under £50k",
  "£50k–£250k",
  "£250k–£1M",
  "Over £1M",
];

const suspectEmployedOptions = ["Yes", "No", "Unknown"];

const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
const formspreeUrl = formspreeId ? `https://formspree.io/f/${formspreeId}` : null;

/**
 * POST full lead to /api/submit-lead → Google Sheets + optional n8n webhook.
 * Formspree fallback when neither is configured (503).
 */
export function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFraudTypes, setSelectedFraudTypes] = useState<string[]>([]);

  function toggleFraudType(type: string) {
    setSelectedFraudTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function submitToFormspree(form: HTMLFormElement): Promise<boolean> {
    if (!formspreeUrl) return false;
    try {
      const data = new FormData(form);
      selectedFraudTypes.forEach((type) => data.append("fraudType", type));
      const res = await fetch(formspreeUrl, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const leadPayload = {
      fullName: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      organisation: String(data.get("organisation") || "").trim(),
      audience: String(data.get("audience") || "").trim(),
      fraudTypes: selectedFraudTypes,
      proceedings: String(data.get("proceedings") || "").trim(),
      lossValue: String(data.get("lossValue") || "").trim(),
      suspectEmployed: String(data.get("suspectEmployed") || "").trim(),
      urgent: data.get("urgent")
        ? "Yes - I need a response within 24 hours"
        : "",
      description: String(data.get("description") || "").trim(),
    };

    if (!leadPayload.fullName || !leadPayload.email) {
      setStatus("error");
      setErrorMessage("Please enter your full name and email.");
      return;
    }

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      });

      if (res.ok) {
        router.push("/thank-you");
        return;
      }

      if (res.status === 503 && (await submitToFormspree(form))) {
        router.push("/thank-you");
        return;
      }

      setStatus("error");
      setErrorMessage(
        res.status === 503
          ? "Lead delivery is not configured. Please email us directly."
          : "Something went wrong. Please try again or email us directly."
      );
    } catch {
      if (await submitToFormspree(form)) {
        router.push("/thank-you");
        return;
      }
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or email us directly.");
    }
  }

  const inputClass =
    "w-full min-h-[44px] min-w-0 rounded border border-border px-3 py-2 text-base text-body focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/20 sm:text-sm";
  const labelClass = "mb-1 block text-sm font-medium text-heading";

  return (
    <form onSubmit={handleSubmit} className="min-w-0 space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="name" className={labelClass}>
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="organisation" className={labelClass}>
            Organisation *
          </label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            required
            autoComplete="organization"
            className={inputClass}
          />
        </div>
      </div>

      <div className="min-w-0">
        <span className={labelClass}>You are: *</span>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {audienceOptions.map((opt) => (
            <label
              key={opt}
              className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded border border-border px-3 py-2"
            >
              <input
                type="radio"
                name="audience"
                value={opt}
                required
                className="h-4 w-4 accent-highlight"
              />
              <span className="text-sm text-body">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
      </div>

      <div className="min-w-0">
        <span className={labelClass}>Fraud Type (select all that apply)</span>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {fraudTypes.map((type) => (
            <label
              key={type}
              className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded border border-border px-3 py-2"
            >
              <input
                type="checkbox"
                checked={selectedFraudTypes.includes(type)}
                onChange={() => toggleFraudType(type)}
                className="h-4 w-4 accent-highlight"
              />
              <span className="text-sm text-body">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="proceedings" className={labelClass}>
            Proceedings
          </label>
          <select id="proceedings" name="proceedings" className={inputClass}>
            {proceedingsOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor="lossValue" className={labelClass}>
            Approximate loss value
          </label>
          <select id="lossValue" name="lossValue" className={inputClass}>
            {lossValues.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="min-w-0">
        <label htmlFor="suspectEmployed" className={labelClass}>
          Is the suspect still employed?
        </label>
        <select
          id="suspectEmployed"
          name="suspectEmployed"
          className={inputClass}
        >
          {suspectEmployedOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="urgent"
            value="Yes - I need a response within 24 hours"
            className="h-4 w-4 accent-highlight"
          />
          <span className="text-sm text-body">
            Is this urgent? Yes - I need a response within 24 hours
          </span>
        </label>
      </div>

      <div className="min-w-0">
        <label htmlFor="description" className={labelClass}>
          Brief description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className={`${inputClass} min-h-[120px] resize-y`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage ?? "Something went wrong."}{" "}
          <a href={`mailto:${SITE_EMAIL}`} className="underline">
            {SITE_EMAIL}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex min-h-[44px] w-full items-center justify-center rounded bg-highlight px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#b45309] disabled:opacity-60 sm:w-auto sm:text-sm"
      >
        {status === "loading" ? "Submitting…" : "Get Expert Help"}
      </button>
    </form>
  );
}
