interface ChildProps {
  getlogin: string;
  getisLogined: boolean;
}
export const IconUser = ({ getlogin, getisLogined }: ChildProps) => {
  return (
    <div
      className={`
            w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
            ${getisLogined ? 'bg-[#721E1E] text-[#E2D797]' : 'bg-gray-300 text-gray-600'}
            `}
    >
      {getlogin.charAt(0).toUpperCase()}
    </div>
  );
};