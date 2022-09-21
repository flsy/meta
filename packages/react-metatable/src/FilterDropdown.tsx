import React from 'react';
import styled from 'styled-components';
import type {MetaColumn, Filters} from '@falsy/metacore';
import Form from 'react-metaforms';
import {toFormValues, toFilters, FilterValues } from 'metatable';

interface IProps {
  column: MetaColumn;
  filters: Filters;
  onFilter: (filters: Filters) => void;
}

const Wrapper = styled.div`
  padding: 1em 0.5em;
`;


const FilterDropdown = ({ column, onFilter, filters }: IProps) => {
    return (
        <Wrapper>
            <Form
                size="small"
                initialValues={toFormValues(column, filters)}
                fields={column.filterForm}
                onAction={({field, form}) => {
                    if (field.id === 'reset') {
                        form.resetForm({
                            values: {}
                        });
                        return form.submitForm();
                    }
                }}
                onSubmit={(values) => {
                    const filters = toFilters(column, values as FilterValues);
                    onFilter(filters);
                }
                }
            />
        </Wrapper>
    );
};

export default FilterDropdown;
