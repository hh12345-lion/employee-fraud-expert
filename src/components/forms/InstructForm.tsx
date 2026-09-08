"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SITE_EMAIL } from "@/lib/site";
import { submitNetlifyForm } from "@/lib/submitNetlifyForm";

/**
 * POST /api/instruct (Sheets soft-fail) then fire-and-forget /api/submit-lead (webhook).
 */
export function InstructForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      fullName: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      organisation: String(data.get("organisation") || "").trim(),
      audience: String(data.get("audience") || "").trim(),
      description: String(data.get("description") || "").trim(),
    };

    if (!payload.fullName || !payload.email || !payload.description) {
      setStatus("error");
      setErrorMessage("Please enter your name, email, and case brief.");
      return;
    }

    try {
      const res = await fetch("/api/instruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message =
          "Something went wrong. Please try again or email us directly.";
        try {
          const body = (await res.json()) as { error?: string; message?: string };
          if (body.error) message = body.error;
          else if (body.message) message = body.message;
        } catch {
          /* ignore */
        }
        setStatus("error");
        setErrorMessage(message);
        return;
      }

      void fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          formType: "instruct",
        }),
      }).catch(() => {
        console.warn(
          "Lead webhook notification failed; instruction was still logged."
        );
      });

      try {
        await submitNetlifyForm("instruct", {
          name: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          organisation: payload.organisation,
          audience: payload.audience,
          description: payload.description,
        });
      } catch {
        // Netlify form is secondary; don't block the visitor.
      }

      router.push("/thank-you");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again or email us directly.");
    }
  }

  const inputClass =
    "w-full min-h-11 min-w-0 border border-border bg-white px-3 py-2 text-base text-body focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm";
  const labelClass = "mb-1 block text-sm font-medium text-heading";

  return (
    <form
      name="instruct"
      method="POST"
      action="/__forms.html"
      onSubmit={handleSubmit}
      className="min-w-0 space-y-5"
    >
      <input type="hidden" name="form-name" value="instruct" />
      <p className="hidden" aria-hidden="true">
        <label>
          Do not fill this out:{" "}
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="instruct-name" className={labelClass}>
            Full Name *
          </label>
          <input
            id="instruct-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="instruct-email" className={labelClass}>
            Email *
          </label>
          <input
            id="instruct-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="instruct-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="instruct-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="instruct-organisation" className={labelClass}>
            Firm / Organisation
          </label>
          <input
            id="instruct-organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            className={inputClass}
          />
        </div>
      </div>

      <div className="min-w-0">
        <label htmlFor="instruct-audience" className={labelClass}>
          You are
        </label>
        <select
          id="instruct-audience"
          name="audience"
          className={inputClass}
          defaultValue=""
        >
          <option value="">Select one (optional)</option>
          <option value="Solicitor / Law Firm">Solicitor / Law Firm</option>
          <option value="Employer / HR / Finance">Employer / HR / Finance</option>
          <option value="Insurer">Insurer</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="min-w-0">
        <label htmlFor="instruct-description" className={labelClass}>
          Case brief *
        </label>
        <textarea
          id="instruct-description"
          name="description"
          rows={4}
          required
          placeholder="Matter type, stage, deadlines, and documents available."
          className={`${inputClass} min-h-[100px] resize-y`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-accent" role="alert">
          {errorMessage ?? "Something went wrong."}{" "}
          <a href={`mailto:${SITE_EMAIL}`} className="underline">
            {SITE_EMAIL}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-11 w-full items-center justify-center border border-accent bg-accent px-8 py-3 text-sm font-medium text-primary transition-colors hover:bg-transparent hover:text-accent disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Submitting…" : "Submit instruction"}
      </button>
    </form>
  );
}
