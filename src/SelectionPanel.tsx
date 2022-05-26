import React, {ChangeEvent, useState} from 'react';
import debounce from 'lodash.debounce';

import {Selection} from './dtos/Selection';

import './selections.css';

interface Props {
  index: number;
  selection: Selection;
  onDelete: (id: number) => void;
  onUpdate: (s: Selection) => void;
}

export const SelectionPanel = (props: Props) => {
  const { index, selection, onDelete, onUpdate } = props;
  const [input, setInput] = useState(selection.category);
  const [textArea, setTextArea] = useState(selection.items.join('\n'));

  const onChangeCategory = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    updateOnChange();
  };

  const onChangeItems = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextArea(e.target.value);
    updateOnChange();
  };

  const updateOnChange = debounce(() => {
    onUpdate && onUpdate({
      category: input,
      id: selection.id,
      items: textArea.split('\n')
    });
  }, 300);

  const handleDeleteCategory = () => onDelete(selection.id);

  return (
    <div className="cr-selections__selection" key={`cr-selections__selection-${index}-${selection.id}`}>
      <div className="cr-selections__input-wrapper">
        <label className={`cr-selections__input-label ${input.length ? 'small' : ''}`}>Category</label>
        <input className={'cr-selections__input'} value={input} onChange={onChangeCategory} />
      </div>
      <textarea className={'cr-selections__textarea'} value={textArea} placeholder="Selection" onChange={onChangeItems} />
      <button onClick={handleDeleteCategory}>
        <i className="material-icons">delete_outline</i>
      </button>
    </div>
  )
}