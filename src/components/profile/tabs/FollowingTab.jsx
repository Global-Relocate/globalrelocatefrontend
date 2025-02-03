import bellicon from "../../../assets/svg/bell.svg";

const FollowingTab = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[45vh]">
      <img
        src={bellicon}
        alt="Bell Icon"
        className="mb-4"
        style={{ width: '36px', height: '36px', filter: 'invert(41%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(91%) contrast(88%)' }}
      />
      <p className="text-gray-600">You don&apos;t have any following notifications yet.</p>
    </div>
  );
};

export default FollowingTab; 