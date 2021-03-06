/* @flow */

import React, { PropTypes } from 'react';
import {
  I18nManager,
  Image,
  Text,
  View,
  Platform,
  StyleSheet,
} from 'react-native';

import type { LayoutEvent } from '../TypeDefinition';

import TouchableItem from './TouchableItem';

type Props = {
  onPress?: () => void,
  title?: ?string,
  tintColor?: ?string,
  truncatedTitle?: ?string,
};

type DefaultProps = {
  tintColor: ?string,
  truncatedTitle: ?string,
};

type State = {
  containerWidth?: number,
  initialTextWidth?: number,
};

class HeaderBackButton extends React.PureComponent<DefaultProps, Props, State> {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    title: PropTypes.string,
    tintColor: PropTypes.string,
    truncatedTitle: PropTypes.string,
  };

  static defaultProps = {
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
  };

  state = {};

  _onContainerLayout = (e: LayoutEvent) => {
    if (Platform.OS !== 'ios') {
      return;
    }
    this.setState({
      containerWidth: e.nativeEvent.layout.width,
    });
  };

  _onTextLayout = (e: LayoutEvent) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  render() {
    const { onPress, title, tintColor, truncatedTitle } = this.props;

    const renderTruncated = this.state.containerWidth && this.state.initialTextWidth
      ? this.state.containerWidth < this.state.initialTextWidth
      : false;

    return (
      <TouchableItem
        delayPressIn={0}
        onPress={onPress}
        style={styles.container}
        borderless
      >
        <View
          onLayout={this._onContainerLayout}
          style={styles.container}
        >
          <Image
            style={[
              styles.icon,
              title && styles.iconWithTitle,
              { tintColor },
            ]}
            source={require('./assets/back-icon.png')}
          />
          {Platform.OS === 'ios' && title && (
            <Text
              ellipsizeMode="middle"
              onLayout={this._onTextLayout}
              style={[styles.title, { color: tintColor }]}
              numberOfLines={1}
            >
              {renderTruncated ? truncatedTitle : title}
            </Text>
          )}
        </View>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon: Platform.OS === 'ios'
    ? {
      height: 20,
      width: 12,
      marginLeft: 10,
      marginRight: 22,
      marginVertical: 12,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }
    : {
      height: 24,
      width: 24,
      margin: 16,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  iconWithTitle: Platform.OS === 'ios'
    ? {
      marginRight: 5,
    }
    : {},
});

export default HeaderBackButton;
