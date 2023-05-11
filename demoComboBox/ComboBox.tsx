import * as React from 'react';

import { TagPicker, ITag, IBasePickerSuggestionsProps } from '@fluentui/react/lib/Pickers';

const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggested records',
  noResultsFoundText: 'No records found',
};

const getTextFromItem = (item: ITag) => item.name;

export interface IComboBoxProps {
    onResolveSuggestions: (filterText: string, tagList?: ITag[]) => ITag[] | Promise<ITag[]>;
    onChange: (items?: ITag[] | undefined) => void;
}

export const ComboBox: React.FunctionComponent<IComboBoxProps> = ({onResolveSuggestions, onChange}) => {

  return (
    <TagPicker
    onChange={onChange}
    removeButtonAriaLabel="Remove"
    selectionAriaLabel="Selected records"
    onResolveSuggestions={onResolveSuggestions}
    getTextFromItem={getTextFromItem}
    pickerSuggestionsProps={pickerSuggestionsProps}
    itemLimit={4}
    pickerCalloutProps={{ doNotLayer: false }}
  />
  );
};