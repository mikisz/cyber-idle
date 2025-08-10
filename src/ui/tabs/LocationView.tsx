import { getDistrictById, setActiveDistrict, useGameStore } from '../../game/state/store';
import ButtonNeon from '../components/ButtonNeon';

interface Props {
  onBack: () => void;
}

export default function LocationView({ onBack }: Props) {
  const activeDistrictId = useGameStore((s) => s.world.activeDistrictId);
  const district = activeDistrictId ? getDistrictById(activeDistrictId) : null;

  if (!district) return null;

  return (
    <div className="space-y-4 p-4">
      <button className="text-neon-cyan" onClick={onBack}>
        ← Map
      </button>
      <h2 className="text-xl font-bold">{district.name}</h2>
      <p>{district.description}</p>
      <div className="grid gap-2">
        {district.actions.map((a) => (
          <div key={a.id} className="border p-2">
            <div className="font-semibold">
              {a.iconText && <span className="mr-1">{a.iconText}</span>}
              {a.name}
            </div>
            <div className="text-xs">Requires L{a.minLevel}</div>
          </div>
        ))}
      </div>
      <ButtonNeon onClick={() => setActiveDistrict(null)}>Leave District</ButtonNeon>
    </div>
  );
}
