import { useState } from 'react';
import { Input, Button } from '../../ui';
import type { AddSatelliteData } from '../../../types';

type AddSatelliteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: AddSatelliteData) => void;
};

export const AddSatelliteDialog = (props: AddSatelliteDialogProps) => {
  const { open, onOpenChange, onAdd } = props;
  const [form, setForm] = useState<AddSatelliteData>({ name: '', tle1: '', tle2: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (form.name && form.tle1 && form.tle2) {
      onAdd(form);
      setForm({ name: '', tle1: '', tle2: '' });
      onOpenChange(false);
    }
  };

  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="text-primary-foreground animate-fade-in relative w-full max-w-md rounded-lg border-2 border-blue-400 bg-blue-900 p-6 shadow-lg">
          <h2 className="text-lg font-bold text-blue-400">Add Satellite</h2>
          <button
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 cursor-pointer text-xl font-bold text-blue-400 hover:text-blue-200 focus:outline-none"
          >
            ×
          </button>
          <div className="mt-4 space-y-4">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="text-primary-foreground placeholder:text-primary-foreground/60 border-blue-400 bg-blue-950"
            />
            <Input
              name="tle1"
              placeholder="TLE Line 1"
              value={form.tle1}
              onChange={handleChange}
              className="text-primary-foreground placeholder:text-primary-foreground/60 border-blue-400 bg-blue-950"
            />
            <Input
              name="tle2"
              placeholder="TLE Line 2"
              value={form.tle2}
              onChange={handleChange}
              className="text-primary-foreground placeholder:text-primary-foreground/60 border-blue-400 bg-blue-950"
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              className="border-blue-400 bg-blue-400 text-blue-950 hover:bg-blue-500 hover:text-blue-950"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.name || !form.tle1 || !form.tle2}
              className="border-2 border-blue-400 bg-blue-400 font-semibold text-blue-950 shadow-sm hover:bg-blue-500"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    )
  );
};
