import React from 'react';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';
import { CModal } from './model';

const defaultProps = {
  visible: false,
  transparent: false,
  height: 400,
  styles: {},
  headerStyle: {},
  backgroundColor: 'white',
};

const ModalComponent: CModal = props => {
  const {
    visible,
    maxHeight = 400,
    onRequestClose,
    style,
    backgroundColor,
    headerStyle,
    renderHeader,
  } = props;

  return (
    <Modal {...props} visible={visible} style={{ flex: 1 }}>
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.4)',
          },
          style,
        ]}>
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

ModalComponent.defaultProps = defaultProps;
export default ModalComponent;
