import { useRef, useState } from 'react';
import {
  exportGame,
  importGame,
  clearGame,
} from '../game/save/save';
import { useGameStore, initialState } from '../game/state/store';

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const json = await exportGame();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cyber-idle-save.json';
      a.click();
      URL.revokeObjectURL(url);
      alert('Export successful');
    } catch (err) {
      console.error(err);
      alert('Export failed');
    }
  };

  const handleImport = () => {
    fileInput.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const state = await importGame(text);
      useGameStore.setState(state);
      alert('Import successful');
    } catch (err) {
      console.error(err);
      alert('Import failed');
    } finally {
      e.target.value = '';
    }
  };

  const handleClear = async () => {
    if (!confirm('Clear saved game?')) return;
    try {
      await clearGame();
      useGameStore.setState(initialState);
      alert('Save cleared');
    } catch (err) {
      console.error(err);
      alert('Failed to clear save');
    }
  };

  return (
    <div className="relative text-white">
      <button
        aria-label="Settings"
        onClick={() => setOpen((o) => !o)}
        className="px-2"
      >
        ⚙
      </button>
      {open && (
        <div className="absolute right-0 mt-2 flex flex-col bg-gray-800 p-2 text-sm shadow">
          <button className="mb-1 text-left" onClick={handleExport}>
            Export Save
          </button>
          <button className="mb-1 text-left" onClick={handleImport}>
            Import Save
          </button>
          <button className="text-left" onClick={handleClear}>
            Clear Save
          </button>
        </div>
      )}
      <input
        ref={fileInput}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
