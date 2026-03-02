import type {SelectedMemberContextType} from '../types/useContextTypes';
import {useContext} from 'react';
import {SelectedMemberContext} from '../useContext/Contexts';
export function useSelectedMember(): SelectedMemberContextType {
  const context = useContext(SelectedMemberContext);

  if (!context) {
    throw new Error('useSelectedMember must be used within a SelectedMemberProvider');
  }

  return context;
}
