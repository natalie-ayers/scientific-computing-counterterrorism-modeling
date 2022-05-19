import {
  BsFillSkipStartCircleFill,
  BsFillPauseCircleFill,
  BsFillSkipForwardCircleFill,
  BsFillSkipEndCircleFill,
  BsFillPlayCircleFill,
} from "react-icons/bs";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const PlaybackControls = (props) => {
  return (
    <ToggleButtonGroup
      value={props.speed}
      exclusive
      aria-label="playback setting"
    >
      <ToggleButton
        value="t0"
        aria-label="t0"
        onClick={() => props.setSpeed("t0")}
      >
        <BsFillSkipStartCircleFill />
      </ToggleButton>
      <ToggleButton
        value="pause"
        aria-label="pause"
        onClick={() => props.setSpeed("pause")}
      >
        <BsFillPauseCircleFill />
      </ToggleButton>
      <ToggleButton
        value="play"
        aria-label="play"
        onClick={() => props.setSpeed("play")}
      >
        <BsFillPlayCircleFill />
      </ToggleButton>
      <ToggleButton
        value="fast-forward"
        aria-label="fast-forward"
        onClick={() => props.setSpeed("fast-forward")}
      >
        <BsFillSkipForwardCircleFill />
      </ToggleButton>
      <ToggleButton
        value="skip-to-end"
        aria-label="skip-to-end"
        onClick={() => props.setSpeed("skip-to-end")}
      >
        <BsFillSkipEndCircleFill />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default PlaybackControls;
