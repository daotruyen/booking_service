import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from "react-native";

interface OtpTimerProps {
  /**
   * timer showing minutes
   */
  minutes?: number;
  /**
   * timer showing seconds
   */
  seconds?: number;
  /**
   * styling of otp timer
   */
  timerStyle?: StyleProp<TextStyle>;
  /**
   * text content of resend button
   */
  resendButtonText?: string;
  /**
   * styling of resend button
   */
  resendButtonStyle: StyleProp<ViewStyle>;
  /**
   * styling of resend button text
   */
  resendButtonTextStyle: StyleProp<TextStyle>;
  /**
   * action to perform after clicking resend button
   */
  resendButtonAction: () => void;
}

const RnOtpTimer = (props: OtpTimerProps): JSX.Element => {
  const [minutes, setMinutes] = useState<number>(
    props.minutes ? props.minutes : 0
  );
  const [seconds, setSeconds] = useState<number>(
    props.seconds ? props.seconds : 30
  );
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  useEffect(() => {
    let countDown: NodeJS.Timeout;
    if (isTimerActive) {
      countDown = setInterval(() => {
        if (seconds > 0) {
          setSeconds((seconds) => seconds - 1);
        }
      }, 1000);
    }

    if (!seconds) {
      setIsTimerActive(false);
    }
    return () => clearInterval(countDown);
  }, [seconds, isTimerActive]);

  return (
    <View style={styles.otpViewStyle}>
      <Text>OTP sẽ được tạo mới lại sau :</Text>
      <Text style={props.timerStyle}>
        {Math.floor(seconds / 60)}:
        {(seconds % 60) < 10 ? `0${(seconds % 60)}` : (seconds % 60)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  otpViewStyle: {
    flexDirection: 'row',
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default RnOtpTimer;
