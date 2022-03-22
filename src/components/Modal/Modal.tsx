import React from 'react';
import styled from 'styled-components';

import Card from '../Card';
import CardContent from '../CardContent';
import Container from '../Container';

import loadIcon from '../../assets/img/loading.svg';

export interface ModalProps {
  children?: React.ReactNode,
  onDismiss?: () => void,
  variant?: 'default' | 'modal'
}

const Modal: React.FC<ModalProps> = ({ children, variant }) => {

  return (
    <Container size="md">
      <StyledModal imageURL={loadIcon}>
        <Card
          variant={variant}
          >
          <CardContent>{children}</CardContent>
        </Card>
      </StyledModal>
    </Container>
  );
};

interface StyledModalProps {
  imageURL: string
}

const StyledModal = styled.div<StyledModalProps>`
  border-radius: 12px;
  box-shadow: 24px 24px 48px -24px ${(props) => props.theme.color.grey[900]};
  overflow: hidden;
  position: relative;

  .loading & {

    &:after {
      background-color: rgba(0,0,0,0.8);
      background-image: url(${props => props.imageURL});
      background-position: center;
      background-repeat: no-repeat;
      content: '';
      position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
    }
  }
`;

export default Modal;
