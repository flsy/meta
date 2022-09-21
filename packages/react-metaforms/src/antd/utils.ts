import {
    TextMetaProps,
    NumberMetaProps,
    PasswordMetaProps,
    SelectMetaProps,
    TextareaMetaProps,
    CheckboxMetaProps,
    SubmitMetaProps,
    DateMetaProps,
    ImageMetaProps,
    FileMetaProps,
    DateRangeMetaProps,
    MultiSelectMetaProps,
    AutocompleteMetaProps,
    MetaField,
    ObjectMetaProps,
    HiddenMetaProps,
    ActionMetaProps,
    IThreeStateSwitch, LayoutMetaProps,
} from '@falsy/metacore';

export const isText = (field: MetaField): field is TextMetaProps => field.type === 'text';
export const isNumber = (field: MetaField): field is NumberMetaProps => field.type === 'number';
export const isHidden = (field: MetaField): field is HiddenMetaProps => field.type === 'hidden';
export const isPassword = (field: MetaField): field is PasswordMetaProps => field.type === 'password';
export const isSelect = (field: MetaField): field is SelectMetaProps => field.type === 'select';
export const isTextarea = (field: MetaField): field is TextareaMetaProps => field.type === 'textarea';
export const isCheckbox = (field: MetaField): field is CheckboxMetaProps => field.type === 'checkbox';
export const isSubmit = (field: MetaField): field is SubmitMetaProps => field.type === 'submit';
export const isDate = (field: MetaField): field is DateMetaProps => field.type === 'date';
export const isImage = (field: MetaField): field is ImageMetaProps => field.type === 'image';
export const isFile = (field: MetaField): field is FileMetaProps => field.type === 'file';
export const isDateRange = (field: MetaField): field is DateRangeMetaProps => field.type === 'dateRange';
export const isMultiselect = (field: MetaField): field is MultiSelectMetaProps => field.type === 'multiselect';
export const isAutocomplete = (field: MetaField): field is AutocompleteMetaProps => field.type === 'autocomplete';
export const isObject = (field: MetaField): field is ObjectMetaProps => field.type === 'object';
export const isAction = (field: MetaField): field is ActionMetaProps => field.type === 'action';
export const isLayout = (field: MetaField): field is LayoutMetaProps => field.type === 'layout';
export const isThreeStateSwitch = (field: MetaField): field is IThreeStateSwitch => field.type === 'threeStateSwitch';
