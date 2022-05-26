import React, { useEffect, useRef, useState } from 'react';

import { shuffle } from './utils/shuffle';
import { Selected } from './dtos/Selected';
import { Selection } from './dtos/Selection';
import { SelectionPanel } from './SelectionPanel';
import { Profile } from './Profile';
import { getSelectionForProfile, loadPersistedSelection, persistSelection } from './utils/persistence';

import './App.css';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [edit, setEdit] = useState(false);
  const selections = useRef<Selection[]>([]);
  const selected = useRef<Selected[]>([]);
  const profile = useRef<string>('');
  const [_, setUpdated] = useState<number>(new Date().getTime());

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await loadPersistedSelection();
    setLoaded(true);
    // handleLegacy();
  }

  const handlePersistence = async (data?: any) => {
    const persistedSelections = localStorage.getItem(`custom-randomizer::${profile.current}`);
    if (persistedSelections) {
      selections.current = JSON.parse(persistedSelections);
      randomizeData();
    } else {
      localStorage.setItem(`custom-randomizer::${profile.current}`, JSON.stringify(data.selection))
    }
  };

  const handleLegacy = async () => {
    if (loaded) {
      const legacyData = localStorage.getItem(`custom-randomizer::test`);
      if (legacyData) {
        const data = JSON.parse(legacyData);
        await persistSelection('Sayunara', data);
        profile.current = 'Sayunara';
        localStorage.setItem('custom-randomizer::Sayunara', JSON.stringify(data));
        localStorage.setItem('custom-randomizer::legacy', JSON.stringify(data));
        localStorage.removeItem('custom-randomizer::test');
        localStorage.setItem('custom-randomizer::profile', 'Sayunara');
      }
    }
  };

  const updateAll = () => setUpdated(new Date().getTime());

  const reset = () => {
    selected.current = [];
    selections.current = [];
    updateAll();
  }

  const handleProfileChange = (profileName: string) => {
    if (!profile.current.length && profileName.length) {
      profile.current = profileName;
      handlePersistence();
    }
    profile.current = profileName;
    const data = getSelectionForProfile(profileName);
    if (data) {
      handlePersistence(data);
    } else {
      reset();
    }
  }

  const randomizeData = () => {
    const randomSelections: Selected[] = [];

    selections.current.map((s) =>
      randomSelections.push({
        category: s.category,
        item: shuffle(s.items)[0]
      })
    );

    selected.current = randomSelections;
    updateAll();
  }

  const handleSelectionUpdate = (data: Selection) => {
    let currentSelections = [...selections.current];
    currentSelections = currentSelections.map((s) => {
      if (s.id === data.id) {
        return data;
      }
      return s;
    });
    selections.current = currentSelections;
    localStorage.setItem(`custom-randomizer::${profile.current}`, JSON.stringify(selections.current));
    updateAll();
  }

  const handleSelectionDelete = (id: number) => {
    console.log('id', id);
    let currentSelections = [...selections.current];
    currentSelections = currentSelections.filter((s) => s.id !== id);
    console.log('currentSelections', currentSelections);
    selections.current = currentSelections;
    localStorage.setItem(`custom-randomizer::${profile.current}`, JSON.stringify(selections.current));
    updateAll();
  }

  const toggleEdit = () => {
    if (edit) {
      persistSelection(profile.current, selections.current);
    }
    setEdit(!edit);
  }

  const addSelection = () => {
    const newSelections = [...selections.current];
    newSelections.push({
      category: '',
      id: new Date().getTime(),
      items: []
    });
    selections.current = newSelections;
    updateAll();
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <b>ESO - Custom Selector</b>
        </p>
      </header>
      <main className="cr-main">
        <section>
          <div className={'content--action'}>
            <Profile onChange={handleProfileChange} />
            <div className="content--action__ctas">
              <button onClick={toggleEdit}>
                <i className="material-icons">{edit ? 'close' : 'edit'}</i>
              </button>
              <button onClick={randomizeData} disabled={edit || !selections.current.length}>
                <i className="material-icons">pets</i>
              </button>
            </div>
          </div>
        </section>
        <section>
          <div className={'content--selection-container'}>
            <div className={'content--selection'}>
              {
                selected.current.length ? selected.current.map((s, i) => (
                  <div className={'content--selection__wrapper'} key={`content--selection-${i}`}>
                    <div className={'content--result'}>
                      <span className={'content--result-label'}>Category:</span> {s.category}
                    </div>
                    <div className={'content--result'}>
                      <span className={'content--result-label'}>Select:</span> {s.item}
                    </div>
                  </div>
                )) : (
                  <div>Aiaiai, select something finally.</div>
                )
              }
            </div>
          </div>
        </section>
        {edit ? (
          <section className="cr-selections">
            {
              selections.current.map((s, i) => (
                <React.Fragment key={`selection-${s.id}-${i}`}>
                  <SelectionPanel selection={s} index={i} onUpdate={handleSelectionUpdate} onDelete={handleSelectionDelete} />
                </React.Fragment>
              ))
            }
            <div className={'cr-selections__actions'}>
              <button onClick={addSelection}>
                <i className="material-icons">add</i>
              </button>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default App;
