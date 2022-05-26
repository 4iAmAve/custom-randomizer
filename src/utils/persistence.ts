import axios from 'axios';

import { PersistedSelections } from '../dtos/PersistedSelections';
import { Selection } from '../dtos/Selection';

let persistedSelection: PersistedSelections[] = [];

export const loadPersistedSelection = async (): Promise<PersistedSelections[]> => {
  try {
    const { data } = await axios.get('./assets/selections.json');
    persistedSelection = data;
    return data;
  } catch (e) {
    console.error('Loading persisted selection failed: ', e);
    return [];
  }
};

export const getSelectionForProfile = (profile: string): PersistedSelections | undefined => {
  return persistedSelection.find((p) => p.name === profile);
};

export const persistSelection = async (profile: string, selection: Selection[]): Promise<void> => {
  let prev = [...persistedSelection];
  prev = prev.filter((p) => p.name !== profile);
  prev.push({
    name: profile,
    selection
  });
  await axios.post('./assets/update.php', JSON.stringify(prev));
  persistedSelection = prev;
}