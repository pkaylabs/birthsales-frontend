import React, { useMemo, useState } from "react";
import { Box, Chip, TextField, Typography } from "@mui/material";

export type ChipInputProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
};

function normalizeToken(token: string): string {
  return token.trim().replace(/\s+/g, " ");
}

export default function ChipInput({
  label,
  values,
  onChange,
  placeholder,
  helperText,
  disabled,
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");

  const lowerSet = useMemo(() => {
    const set = new Set<string>();
    for (const v of values) set.add(v.toLowerCase());
    return set;
  }, [values]);

  const addTokens = (raw: string) => {
    const parts = raw
      .split(",")
      .map(normalizeToken)
      .filter(Boolean);

    if (parts.length === 0) return;

    const next = [...values];
    for (const p of parts) {
      const key = p.toLowerCase();
      if (lowerSet.has(key) || next.some((x) => x.toLowerCase() === key)) continue;
      next.push(p);
    }
    onChange(next);
  };

  const commit = () => {
    if (!inputValue.trim()) return;
    addTokens(inputValue);
    setInputValue("");
  };

  return (
    <Box>
      <TextField
        label={label}
        fullWidth
        value={inputValue}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={() => commit()}
      />

      {helperText && (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      )}

      {values.length > 0 && (
        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {values.map((v) => (
            <Chip
              key={v}
              label={v}
              onDelete={
                disabled
                  ? undefined
                  : () => onChange(values.filter((x) => x !== v))
              }
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
