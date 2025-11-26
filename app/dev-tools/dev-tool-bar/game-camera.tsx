import type { FC } from "react";
import { useState, useEffect } from "react";
import { camera_position, camera_rotation } from "../../camera";
import { player_position_final } from "../../game/player-position";
import { debug_camera_position, debug_camera_rotation, debug_camera_zero } from "../dev";

let updateCounter = 0;

export const GameCameraComponent: FC = () => {
  const [debugCameraEnabled, setDebugCameraEnabled] = useState(!!window.DEBUG_CAMERA);
  const [, setUpdateCounter] = useState(0);

  const update = () => {
    setUpdateCounter(++updateCounter);
    if (debugCameraEnabled !== !!window.DEBUG_CAMERA) {
      setDebugCameraEnabled(!!window.DEBUG_CAMERA);
    }
  };

  useEffect(() => {
    const updateInterval = setInterval(update, 50);
    return () => clearInterval(updateInterval);
  }, []);

  const p = window.DEBUG_CAMERA ? debug_camera_position : camera_position;
  const r = window.DEBUG_CAMERA ? debug_camera_rotation : camera_rotation;

  return (
    <div className="dev-tool-bar-camera">
      <div className="dev-tool-bar-camera-values">
        <div>
          <div className="dev-tool-bar-camera-values-title">位置</div>
          <div>{formatNumber(p.x, 4)}</div>
          <div>{formatNumber(p.y, 4)}</div>
          <div>{formatNumber(p.z, 4)}</div>
        </div>
        <div>
          <div className="dev-tool-bar-camera-values-title">旋转</div>
          <div>{formatNumber(r.x, 2)}</div>
          <div>{formatNumber(r.y, 2)}</div>
          <div>{formatNumber(r.z, 2)}</div>
        </div>
      </div>

      <div style={{ paddingLeft: 10, color: "#aaf" }}>
        <div>玩家</div>
        <div>
          {formatNumber(player_position_final.x, 2)} {formatNumber(player_position_final.y, 2)}{" "}
          {formatNumber(player_position_final.z, 2)}
        </div>
      </div>

      <br />
      <div>
        <label>
          调试相机
          <input
            type="checkbox"
            checked={window.DEBUG_CAMERA}
            onChange={(e) => {
              const value = !!e.target.checked;
              window.DEBUG_CAMERA = value;
              update();
            }}
          />
        </label>
      </div>
      <div>
        <button
          onClick={() => {
            debug_camera_zero();
            update();
          }}
          title="清除"
        >
          ❌
        </button>
        <button onClick={() => console.log({ p, r })} title="日志">
          📜
        </button>
      </div>
    </div>
  );
};

function formatNumber(value: number, digits: number) {
  return value.toLocaleString("en", {
    useGrouping: false,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
