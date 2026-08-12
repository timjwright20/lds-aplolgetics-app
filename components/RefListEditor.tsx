"use client";

import { ScriptureRef } from "@/lib/types";

export default function RefListEditor({
  refs,
  onChange,
  placeholder,
}: {
  refs: ScriptureRef[];
  onChange: (refs: ScriptureRef[]) => void;
  placeholder?: string;
}) {
  const update = (i: number, patch: Partial<ScriptureRef>) => {
    const next = refs.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(refs.filter((_, idx) => idx !== i));
  const add = () => onChange([...refs, { reference: "", note: "" }]);

  return (
    <div className="space-y-2">
      {refs.map((r, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md border border-gray-200 p-2 sm:flex-row">
          <input
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm sm:w-48"
            placeholder={placeholder ?? "e.g. Genesis 1:26"}
            value={r.reference}
            onChange={(e) => update(i, { reference: e.target.value })}
          />
          <input
            className="w-full flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="Note / explanation"
            value={r.note ?? ""}
            onChange={(e) => update(i, { note: e.target.value })}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-md border border-dashed border-maroon-300 px-3 py-1.5 text-sm text-maroon-700 hover:bg-maroon-50"
      >
        + Add reference
      </button>
    </div>
  );
}
