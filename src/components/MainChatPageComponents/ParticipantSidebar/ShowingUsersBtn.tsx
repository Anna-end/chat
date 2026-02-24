interface ChildProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}
export const ShowingUsersBtn = ({ setIsCollapsed, isCollapsed }: ChildProps) => {
  return (
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className="self-end m-1.5 p-1 rounded-md hover:bg-[#721E1E] group transition-colors"
      aria-label={isCollapsed ? 'Развернуть' : 'Свернуть'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 bg-[#E2D797] rounded-md transition-transform duration-300
            ${isCollapsed ? '' : 'rotate-180'}
            group-hover:bg-[#721E1E] group-hover:text-[#E2D797]`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};