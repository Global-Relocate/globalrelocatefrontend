export default function FeaturesCard({ title, para, image }) {
  return (
    <div className="w-full sm:w-[300px] md:w-[380px] flex flex-col items-center justify-evenly min-h-[280px] sm:h-[300px] bg-white rounded-lg shadow-md py-6 sm:py-8 px-4 sm:px-5">
      <img src={image} alt={title} className="w-auto max-w-full h-auto max-h-[120px] sm:max-h-[140px]" />
      <div className="flex flex-col items-center">
        <h2 className="font-medium text-lg sm:text-xl mb-2 sm:mb-4 text-center">{title}</h2>
        <p className="text-[#626262] text-xs sm:text-sm text-center px-2 sm:px-5">
          {para}
        </p>
      </div>
    </div>
  );
}
