export async function submitNetlifyForm(
  formName: string,
  fields: Record<string, string | boolean | undefined>
): Promise<void> {
  const params = new URLSearchParams();
  params.set("form-name", formName);
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === false || value === "") continue;
    params.set(key, value === true ? "yes" : String(value));
  }
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) throw new Error("Netlify form submission failed");
}
