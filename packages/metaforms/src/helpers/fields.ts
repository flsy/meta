import {
  ActionMetaProps,
  AutocompleteMetaProps,
  CheckboxMetaProps,
  DateMetaProps,
  DateRangeMetaProps,
  FileMetaProps,
  HiddenMetaProps,
  ImageMetaProps,
  ISegmentedSwitch,
  JsonMetaProps, LayoutMetaProps,
  MultiSelectMetaProps,
  MultistringMetaProps,
  NumberMetaProps,
  ObjectMetaProps,
  PasswordMetaProps,
  SelectMetaProps,
  SubmitMetaProps,
  TextareaMetaProps,
  TextMetaProps,
  VariableListMetaProps,
} from '@falsy/metacore';


export const getMultiSelectMeta = (props: Omit<MultiSelectMetaProps, 'type'>): MultiSelectMetaProps => ({ ...props, type: 'multiselect' });

export const getTextMeta = (props: Omit<TextMetaProps, 'type'>): TextMetaProps => ({ ...props, type: 'text' });

export const getSubmitMeta = (props: Omit<SubmitMetaProps, 'type'>): SubmitMetaProps => ({ ...props, type: 'submit' });

export const getVariableListMeta = (props: Omit<VariableListMetaProps, 'type'>): VariableListMetaProps => ({ ...props, type: 'variable-list' });

export const getImageMeta = (props: Omit<ImageMetaProps, 'type'>): ImageMetaProps => ({ ...props, type: 'image' });

export const getFileMeta = (props: Omit<FileMetaProps, 'type'>): FileMetaProps => ({ ...props, type: 'file' });

export const getPasswordMeta = (props: Omit<PasswordMetaProps, 'type'>): PasswordMetaProps => ({ ...props, type: 'password' });

export const getTextareaMeta = (props: Omit<TextareaMetaProps, 'type'>): TextareaMetaProps => ({ ...props, type: 'textarea' });

export const getDateMeta = (props: Omit<DateMetaProps, 'type'>): DateMetaProps => ({ ...props, type: 'date' });

export const getNumberMeta = (props: Omit<NumberMetaProps, 'type'>): NumberMetaProps => ({ ...props, type: 'number' });

export const getSelectMeta = (props: Omit<SelectMetaProps, 'type'>): SelectMetaProps => ({ ...props, type: 'select' });

export const getHiddenMeta = (props: Omit<HiddenMetaProps, 'type'>): HiddenMetaProps => ({ ...props, type: 'hidden' });

export const getCheckboxMeta = (props: Omit<CheckboxMetaProps, 'type'>): CheckboxMetaProps => ({ ...props, type: 'checkbox' });

export const getJsonMeta = (props: Omit<JsonMetaProps, 'type'>): JsonMetaProps => ({ ...props, type: 'json' });

export const getDateRangeMeta = (props: Omit<DateRangeMetaProps, 'type'>): DateRangeMetaProps => ({ ...props, type: 'dateRange' });

export const getMultistringMeta = (props: Omit<MultistringMetaProps, 'type'>): MultistringMetaProps => ({ ...props, type: 'multistring' });

export const getSegmentedSwitch = (props: Omit<ISegmentedSwitch, 'type'>): ISegmentedSwitch => ({ ...props, type: 'segmentedSwitch' });

export const getObjectMeta = (props: Omit<ObjectMetaProps, 'type'>): ObjectMetaProps => ({ ...props, type: 'object' });

export const getAutocompleteMeta = (props: Omit<AutocompleteMetaProps, 'type'>): AutocompleteMetaProps => ({ ...props, type: 'autocomplete' });

export const getActionMeta = (props: Omit<ActionMetaProps, 'type' | 'name'>): ActionMetaProps => ({ ...props, type: 'action', name: props.id });

export const getLayoutMeta = (props: Omit<LayoutMetaProps, 'type' | 'name'>): LayoutMetaProps => ({ ...props, type: 'layout', name: '' });
