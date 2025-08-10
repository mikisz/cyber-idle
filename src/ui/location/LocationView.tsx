import { useEffect, useState } from 'react';
import { getDistrictById, setActiveDistrict, useGameStore } from '../../game/state/store';
import { startDistrictAction, stopDistrictAction, getDistrictActionDuration } from '../../game/district';
import ButtonNeon from '../components/ButtonNeon';
import Card from '../components/Card';
import ProgressBarNeon from '../components/ProgressBarNeon';

interface Props {
  onBack: () => void;
}

export default function LocationView({ onBack }: Props) {
  const activeDistrictId = useGameStore((s) => s.world.activeDistrictId);
  const runtime = useGameStore((s) => s.districtRuntime);
  const state = useGameStore();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const district = activeDistrictId ? getDistrictById(activeDistrictId) : null;
  if (!district) return null;

  const handleLeave = () => {
    stopDistrictAction();
    setActiveDistrict(null);
    onBack();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <button className="text-neon-cyan" onClick={onBack}>
          Map
        </button>
        <span>&gt;</span>
        <span>{district.name}</span>
        <div className="flex-1" />
        <ButtonNeon onClick={handleLeave}>Leave</ButtonNeon>
      </div>
      <p>{district.description}</p>
      <div className="grid gap-2">
        {district.actions.map((a) => {
          const running = runtime.isRunning && runtime.runningActionId === a.id;
          const duration = getDistrictActionDuration(a, state);
          const progress = running && runtime.startedAt
            ? Math.min(100, ((now - runtime.startedAt) / duration) * 100)
            : 0;
          return (
            <Card key={a.id} className="p-2 space-y-2">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">
                    {a.iconText && <span className="mr-1">{a.iconText}</span>}
                    {a.name}
                  </div>
                  <div className="text-xs">
                    {a.kind} · L{a.minLevel} · {(duration / 1000).toFixed(1)}s
                  </div>
                </div>
                {running ? (
                  <ButtonNeon onClick={stopDistrictAction}>Stop</ButtonNeon>
                ) : (
                  <ButtonNeon onClick={() => startDistrictAction(a.id)}>
                    Start
                  </ButtonNeon>
                )}
              </div>
              {running && <ProgressBarNeon percentage={progress} />}
            </Card>
          );
        })}
      </div>
      <div>
        <h3 className="font-bold mb-1">Recent</h3>
        <div className="min-h-[3rem] text-sm">
          {/* Placeholder for logs */}
        </div>
      </div>
    </div>
  );
}
