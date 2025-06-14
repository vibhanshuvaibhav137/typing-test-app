import { useState } from "react";
import TypingBox from "../components/TypingBox.jsx";
import TimerButtons from "../components/TimerButton.jsx";
import ToggleControls from "../components/ToggleControls.jsx";

const Home = () => {
  const [duration, setDuration] = useState(60);
  const [includeUpper, setIncludeUpper] = useState(false);
  const [includeSpecial, setIncludeSpecial] = useState(false);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold text-center">Typing Test Settings</h2>
      <TimerButtons onSelect={setDuration} />
      <ToggleControls
        includeUpper={includeUpper}
        setIncludeUpper={setIncludeUpper}
        includeSpecial={includeSpecial}
        setIncludeSpecial={setIncludeSpecial}
      />
      <TypingBox
        duration={duration}
        includeUpper={includeUpper}
        includeSpecial={includeSpecial}
      />
    </main>
  );
};

export default Home;
