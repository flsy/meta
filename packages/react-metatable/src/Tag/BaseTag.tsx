import { Tag } from 'antd';
import styled from 'styled-components';

const BaseTag = styled(Tag)`
  display: block !important;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default BaseTag;
