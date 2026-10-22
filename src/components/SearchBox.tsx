import { useEffect, useRef, useState } from 'react';
import { Input } from './Input';

type SearchBoxProps = {
  label: string;
  placeholder?: string;
  /** The committed value, normally from the URL */
  value: string;
  onCommit: (value: string) => void;
  delayMs?: number;
};

export function SearchBox({ label, placeholder, value, onCommit, delayMs = 250 }: SearchBoxProps) {
  const [draft, setDraft] = useState(value);
  const [committed, setCommitted] = useState(value);
  const [seenValue, setSeenValue] = useState(value);
  const timer = useRef<number | undefined>(undefined);

  // The outside value changed. If it was not our own commit (for example the
  // Back button or Clear filters), show it in the box.
  if (value !== seenValue) {
    setSeenValue(value);
    if (value !== committed) {
      setDraft(value);
      setCommitted(value);
    }
  }

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  function handleChange(text: string) {
    setDraft(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCommitted(text);
      onCommit(text);
    }, delayMs);
  }

  return (
    <Input
      label={label}
      type="search"
      placeholder={placeholder}
      value={draft}
      onChange={(event) => handleChange(event.target.value)}
    />
  );
}
