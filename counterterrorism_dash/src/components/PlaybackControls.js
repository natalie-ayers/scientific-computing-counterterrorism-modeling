import { useState, useEffect, useCallback } from "react";
import { 
    BsFillSkipStartCircleFill, 
    BsFillPauseCircleFill,
    BsFillSkipForwardCircleFill, 
    BsFillSkipEndCircleFill, 
    BsFillPlayCircleFill} from "react-icons/bs";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const PlaybackControls = () => {
    const [speed, setSpeed] = useState('stop')

    const handleSpeed = (event, newSpeed) => {
        setSpeed(newSpeed);
      };

    return (
        <ToggleButtonGroup
        value={speed}
        exclusive
        onChange={handleSpeed}
        aria-label="playback setting"
        >
        <ToggleButton value="stop" aria-label="stop">
            <BsFillSkipStartCircleFill />
        </ToggleButton>
        <ToggleButton value="pause" aria-label="pause">
            <BsFillPauseCircleFill />
        </ToggleButton>
        <ToggleButton value="play" aria-label="play">
            <BsFillPlayCircleFill />
        </ToggleButton>
        <ToggleButton value="fast-forward" aria-label="fast-forward">
            <BsFillSkipForwardCircleFill />
        </ToggleButton>
        <ToggleButton value="skip-to-end" aria-label="skip-to-end">
            <BsFillSkipEndCircleFill />
        </ToggleButton>
        </ToggleButtonGroup>
    );
}

export default PlaybackControls;