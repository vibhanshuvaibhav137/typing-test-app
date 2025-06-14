const ToggleControls = ({ includeUpper, setIncludeUpper, includeSpecial, setIncludeSpecial }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={includeUpper}
          onChange={(e) => setIncludeUpper(e.target.checked)}
        />
        Include Uppercase
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={includeSpecial}
          onChange={(e) => setIncludeSpecial(e.target.checked)}
        />
        Include Special Characters
      </label>
    </div>
  );
};

export default ToggleControls;
