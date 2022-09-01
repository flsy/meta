import { TextMetaProps, NumberMetaProps, PasswordMetaProps, SelectMetaProps, TextareaMetaProps, CheckboxMetaProps, SubmitMetaProps, DateMetaProps, ImageMetaProps, FileMetaProps, DateRangeMetaProps, MultiSelectMetaProps } from 'metahelpers';

export const isText = (field: any): field is TextMetaProps => field.type === 'text';
export const isNumber = (field: any): field is NumberMetaProps => field.type === 'number';
export const isPassword = (field: any): field is PasswordMetaProps => field.type === 'password';
export const isSelect = (field: any): field is SelectMetaProps => field.type === 'select';
export const isTextarea = (field: any): field is TextareaMetaProps => field.type === 'textarea';
export const isCheckbox = (field: any): field is CheckboxMetaProps => field.type === 'checkbox';
export const isSubmit = (field: any): field is SubmitMetaProps => field.type === 'submit';
export const isDate = (field: any): field is DateMetaProps => field.type === 'date';
export const isImage = (field: any): field is ImageMetaProps => field.type === 'image';
export const isFile = (field: any): field is FileMetaProps => field.type === 'file';
export const isDateRange = (field: any): field is DateRangeMetaProps => field.type === 'dateRange';
export const isMultiselect = (field: any): field is MultiSelectMetaProps => field.type === 'multiselect';
