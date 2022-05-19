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
      value={props.controlState}
      exclusive
      aria-label="playback setting"
    >
      <ToggleButton
        value="skip-to-beginning"
        aria-label="skip-to-beginning"
        onClick={() => {
            props.setTimestep(0)
            props.setActive(false)
            props.setControlState("skip-to-beginning")
        }}
      >
        <BsFillSkipStartCircleFill />
      </ToggleButton>
      <ToggleButton
        value="pause"
        aria-label="pause"
        onClick={() => {
            props.setActive(false)
            props.setControlState("pause")
        }}
      >
        <BsFillPauseCircleFill />
      </ToggleButton>
      <ToggleButton
        value="play"
        aria-label="play"
        onClick={() => {
            props.setMsPerStep(1000)
            props.setActive(true)
            props.setControlState("play")
        }}
      >
        <BsFillPlayCircleFill />
      </ToggleButton>
      <ToggleButton
        value="fast-forward"
        aria-label="fast-forward"
        onClick={() => {
            props.setMsPerStep(100)
            props.setActive(true)
            props.setControlState("fast-forward")
        }}
      >
        <BsFillSkipForwardCircleFill />
      </ToggleButton>
      <ToggleButton
        value="skip-to-end"
        aria-label="skip-to-end"
        onClick={() => {
            props.setTimestep(props.max_timestep)
            props.setActive(false)
            props.setControlState("skip-to-end")
        }}
      >
        <BsFillSkipEndCircleFill />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default PlaybackControls;
