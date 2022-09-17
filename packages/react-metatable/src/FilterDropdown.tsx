import { MetaField } from 'metaforms';
import { lensProp, set } from 'ramda';
import React from 'react';
import styled from 'styled-components';
import type { InternalColumn } from './types';
import Form from "react-metaforms";
import FormButtonGroup from "react-metaforms/lib/antd/components/FormButtonGroup";

interface IProps {
  column: InternalColumn;
  onFilter: (column: InternalColumn) => void;
}

const Wrapper = styled.div`
  padding: 1em 0.5em;
`;

const FilterDropdown = ({ column, onFilter }: IProps) => {
  const handleSubmitFilter = (fields: MetaField[]) => {
    onFilter(set(lensProp('filterForm'), fields, column));
  };

  return (
    <Wrapper>
      <Form
        size="small"
        fields={column.filterForm}
        onSubmit={({ fields }) => handleSubmitFilter(fields)}
        // components={({ form, field }) => {
        //   if (field?.type === 'buttonGroup') {
        //     return (
        //       <FormButtonGroup
        //         items={field.items}
        //         isSubmitting={field.isSubmitting}
        //         onClick={async (button) => {
        //           if (button.type === 'reset') {
        //             form.setFieldValue(`${column.flatName}.filters`, undefined);
        //             await form.submitForm();
        //           }
        //         }}
        //       />
        //     );
        //   }
        //
        //   return;
        // }}
      />
    </Wrapper>
  );
};

export default FilterDropdown;
