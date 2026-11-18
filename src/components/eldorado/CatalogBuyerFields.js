"use client";

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function fieldName(field) {
  return String(asRecord(field).name || asRecord(field).key || "").trim();
}

function fieldOptions(field) {
  const raw = asRecord(field).options;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        const value = String(item).trim();
        return value ? { value, label: value } : null;
      }
      const rec = asRecord(item);
      const value = String(rec.value ?? rec.id ?? rec.key ?? "").trim();
      if (!value) return null;
      return { value, label: String(rec.labelFa || rec.label || rec.title || value) };
    })
    .filter(Boolean);
}

function isSelectField(field) {
  const type = String(asRecord(field).type || "").toLowerCase();
  return fieldOptions(field).length > 0 || type === "select" || type === "dropdown";
}

function fieldInputType(field) {
  const type = String(asRecord(field).type || "text").toLowerCase();
  if (type === "password") return "password";
  if (type === "email") return "email";
  return "text";
}

function isSecretField(field) {
  const type = String(asRecord(field).type || "").toLowerCase();
  const name = fieldName(field).toLowerCase();
  return (
    type === "password" ||
    type === "email" ||
    name === "email" ||
    name === "account_password" ||
    name === "backup_code" ||
    name === "ea_id" ||
    name === "psn_id"
  );
}

function isLatinField(field) {
  const name = fieldName(field).toLowerCase();
  return isSecretField(field) || /id|uid|player|user|server|login|email/i.test(name);
}

export default function CatalogBuyerFields({ fields = [], values = {}, onChange, className = "" }) {
  const rows = Array.isArray(fields) ? fields : [];
  if (rows.length === 0) return null;
  return (
    <div className={className || "flex flex-col gap-3"}>
      {rows.map((raw) => {
        const field = asRecord(raw);
        const name = fieldName(field);
        if (!name) return null;
        const label = String(field.label || name);
        const help = String(field.help || "").trim();
        const required = field.required !== false;
        const value = String(values?.[name] ?? "");
        const latin = isLatinField(field);
        const options = fieldOptions(field);
        const controlClass = "min-h-10 w-full rounded-md border border-cardborder bg-white px-3 py-2 text-sm text-nav";
        return (
          <label key={name} className="block text-sm text-graytext">
            <span className="mb-1 block font-bold text-nav">{label}</span>
            {isSelectField(field) ? (
              <select
                name={name}
                required={required}
                value={value}
                dir={latin ? "auto" : undefined}
                onChange={(event) => onChange?.(name, event.target.value)}
                className={controlClass}
              >
                <option value="">{label}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={fieldInputType(field)}
                name={name}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                dir={latin ? "auto" : undefined}
                required={required}
                value={value}
                onChange={(event) => onChange?.(name, event.target.value)}
                className={controlClass}
              />
            )}
            {help ? <span className="mt-1 block text-[12px] leading-[18px]">{help}</span> : null}
          </label>
        );
      })}
    </div>
  );
}
