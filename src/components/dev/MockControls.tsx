import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { getMockMode, setMockMode } from '../../mocks/settings';
import type { MockMode } from '../../mocks/settings';

const MODES: { mode: MockMode; label: string }[] = [
  { mode: 'normal', label: 'Normal' },
  { mode: 'slow', label: 'Slow (4s)' },
  { mode: 'error', label: 'Error (500)' },
  { mode: 'empty', label: 'Empty' },
];

export function MockControls() {
  const queryClient = useQueryClient();
  const [active, setActive] = useState<MockMode>(getMockMode());
  const [keepData, setKeepData] = useState(false);

  function choose(mode: MockMode) {
    setMockMode(mode);
    setActive(mode);

    if (keepData) {
      void queryClient.invalidateQueries();
    } else {
      void queryClient.resetQueries();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-slate-300 bg-white p-3 shadow-lg">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Mock server
      </p>
      <div className="flex gap-1">
        {MODES.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            aria-pressed={active === mode}
            onClick={() => choose(mode)}
            className={clsx(
              'rounded-md px-2 py-1 text-xs font-medium',
              active === mode
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={keepData}
          onChange={(event) => setKeepData(event.target.checked)}
        />
        Keep loaded data when switching
      </label>
    </div>
  );
}
