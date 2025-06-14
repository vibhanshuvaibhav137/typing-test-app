const durations = [10, 30, 60, 120];

const TimerButtons = ({ onSelect }) => {
  return (
    <div className="flex gap-3 justify-center mt-4">
      {durations.map((sec) => (
        <button
          key={sec}
          onClick={() => onSelect(sec)}
          className="px-4 py-2 bg-primary hover:bg-indigo-700 text-white rounded-full transition-all"
        >
          {sec}s
        </button>
      ))}
    </div>
  );
};

export default TimerButtons;
