import { Badge, Checkbox, List } from 'antd';
import Fuse from 'fuse.js';
import { head } from 'ramda';
import React, { Ref, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { KeyboardKey, useBoolean, useKeyPress } from '../../hooks';
import { toggleSelection } from '../../hooks/useSelection';
import Input from './Input';
import { MultiSelectMetaProps } from 'metaforms';

type MultiSelectMetaValue = string | number;

interface ICheckboxListProps extends Omit<MultiSelectMetaProps, 'type'> {
  size?: 'default' | 'large' | 'small';
  onChange: (value: MultiSelectMetaValue[]) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  showSelectedCounter?: boolean;
  showFilterInput?: boolean;
  value: MultiSelectMetaValue[];
}

const ListItem = styled(List.Item)<{ $focused: boolean }>`
  ${({ $focused }) =>
    $focused &&
    css`
      background: rgba(180, 180, 180, 0.1);
    `}
  cursor: pointer;
`;

const ListItemContent = styled.div`
  cursor: pointer;
  display: flex;
  column-gap: 10px;
`;

const ToggleResults = styled.div`
  padding: 0.5em 0;

  & > span {
    margin-left: 0.5em;
  }
`;

const Multiselect = React.forwardRef(
  (
    {
      options = [],
      value = [],
      onChange,
      placeholder,
      disabled,
      onFocus,
      onBlur,
      showSelectedCounter = true,
      showFilterInput = true,
    }: ICheckboxListProps,
    ref: Ref<any>,
  ) => {
    const focusedRef = useRef(null);
    const [search, setSearch] = useState<string>();
    const [focused, setFocused] = useState<MultiSelectMetaValue>();
    const inputFocused = useBoolean(false);
    const showSelected = useBoolean(false);

    const shouldRegisterKeyPress = Boolean(disabled || !inputFocused.value);

    const downPress = useKeyPress(KeyboardKey.arrowDown, shouldRegisterKeyPress);
    const upPress = useKeyPress(KeyboardKey.arrowUp, shouldRegisterKeyPress);
    const spacePress = useKeyPress(KeyboardKey.space, shouldRegisterKeyPress);

    const [filteredOptions, setFilteredOptions] = useState(options);

    const handleClick = (itemValue: MultiSelectMetaValue) => {
      if (disabled) {
        return;
      }

      const opts = toggleSelection(itemValue, value);
      const visibleOptions = showSelected.value ? filteredOptions.filter((o) => opts.includes(o.value)) : filteredOptions;

      if (inputFocused.value && !visibleOptions.find((vo) => vo.value === focused)) {
        setFocused(head(visibleOptions)?.value);
      }

      setFilteredOptions(visibleOptions);
      onChange(opts);
    };

    const handleSelectAll = (checked: boolean) => {
      onChange(checked ? options.map((opt) => opt.value) : []);
    };

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      inputFocused.setTrue();
      setFocused(head(filteredOptions)?.value);
      onFocus?.(event);
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      inputFocused.setFalse();
      setFocused(undefined);
      onBlur?.(event);
    };

    useEffect(() => {
      const fuse = new Fuse(options, { keys: ['label'] });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const filteredOptions = search ? fuse.search(search).map((result) => result.item) : options;
      const visibleOptions = showSelected.value ? filteredOptions.filter((o) => value.includes(o.value)) : filteredOptions;
      setFilteredOptions(visibleOptions);
      setFocused(inputFocused.value ? head(visibleOptions)?.value : undefined);
    }, [search, options, showSelected.value]);

    useEffect(() => {
      if (spacePress && focused) {
        handleClick(focused);
      }
    }, [spacePress]);

    useEffect(() => {
      const curr = focusedRef?.current;
      if (curr) {
        curr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, [focused]);

    useEffect(() => {
      if (inputFocused.value) {
        const focusedOptionIdx = filteredOptions.findIndex((o) => o.value === focused);
        if (downPress) {
          const newIndex = focusedOptionIdx + 1 >= filteredOptions.length ? filteredOptions.length - 1 : focusedOptionIdx + 1;
          return setFocused(filteredOptions[newIndex]?.value);
        }

        if (upPress) {
          const newIndex = focusedOptionIdx - 1 < 0 ? 0 : focusedOptionIdx - 1;
          return setFocused(filteredOptions[newIndex]?.value);
        }
      }
    }, [downPress, upPress]);

    return (
      <>
        {showFilterInput && (
          <Input
            ref={ref}
            placeholder={placeholder}
            name="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        )}
        <ToggleResults>
          <span>
            <Checkbox
              checked={value.length && value.length === options.length}
              indeterminate={value.length && value.length < options.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              Označit vše
            </Checkbox>
          </span>
          {showSelectedCounter && (
            <>
              <Checkbox checked={showSelected.value} onChange={(e) => showSelected.setValue(e.target.checked)} />
              <span>Zobrazit pouze vybrané {value && <Badge size="small" count={value.length} />}</span>
            </>
          )}
        </ToggleResults>
        <List
          bordered={true}
          size="small"
          style={{ maxHeight: '200px', overflow: 'auto' }}
          dataSource={filteredOptions}
          renderItem={(item) => {
            const isSelected = value.includes(item.value);
            const isFocused = focused === item.value;
            return (
              <ListItem $focused={isFocused} onClick={() => handleClick(item.value)} style={item.style}>
                <ListItemContent ref={isFocused ? focusedRef : undefined}>
                  <Checkbox disabled={disabled} checked={isSelected} />
                  {item.label}
                </ListItemContent>
              </ListItem>
            );
          }}
        />
      </>
    );
  },
);

Multiselect.displayName = 'Multiselect';

export default Multiselect;
