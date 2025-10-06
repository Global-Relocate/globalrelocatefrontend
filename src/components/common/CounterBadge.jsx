const CounterBadge = ({ count }) => {
  if (!count) return null;

  return (
    <div className="bg-red-500 ml-4 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {count}
    </div>
  );
};

export default CounterBadge;
