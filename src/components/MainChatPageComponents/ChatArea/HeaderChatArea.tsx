import { useSelectedMember } from '../../../hooks/useSelectedMemberContext'
export const HeaderChatArea = () => {
  const { member } = useSelectedMember();
  return (
    <div className="p-4 shadow-md bg-[#721E1E]">
      <h1 className="text-xl font-bold text-white">Чат</h1>
      <p className="text-sm text-[#E2D797]">{member?.login}</p>
    </div>
  );
};