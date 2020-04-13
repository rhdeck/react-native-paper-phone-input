import React, { useRef, useState, useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { TextInput } from "react-native-paper";
import CountryModal from "react-native-country-picker-modal";
import MaskedInput from "react-native-text-input-mask";
const globalMasks = {
  US: { mask: "+1 ([000]) [000]-[0000]", length: 10, prefix: "+1" },
  CA: { mask: "+1 ([000]) [000]-[0000]", length: 10, prefix: "+1" },
  UK: { mask: "+44 [000] [000] [0000]", length: 10, prefix: "+44" },
};
const PaperPhoneInput = ({
  isCountryPicker = false,
  onChangeText,
  masks: propMasks,
  containerStyle = {},
  ...props
}) => {
  const phoneRef = useRef();
  const [cca2, setCca2] = useState("US");
  const isDark = useColorScheme() === "dark";
  const themes = isDark ? { theme: DARK_THEME } : {};
  const [extracted, setExtracted] = useState("");
  const [masks, setMasks] = useState(globalMasks);
  useEffect(() => {
    setMasks({ ...globalMasks, ...propMasks });
  }, [propMasks]);
  const [mask, setMask] = useState(masks["US"].mask);
  useEffect(() => {
    setMask(masks[cca2] ? masks[cca2].mask : masks["US"].mask);
  }, [cca2, masks]);
  useEffect(() => {
    const { length, prefix } = masks[cca2];
    if (extracted.length === length) {
      onChangeText(prefix + extracted);
    } else {
      onChangeText("");
    }
  }, [extracted, cca2, onChangeText, masks]);
  return (
    <View style={[{ flexDirection: "row" }, containerStyle]}>
      {isCountryPicker && (
        <CountryModal
          onSelect={({ cca2 }) => {
            setCca2(cca2);
            phoneRef.current && phoneRef.current.focus();
          }}
          countryCode={cca2}
          translation="eng"
          cancelText="Cancel"
          {...themes}
          visible={false}
          withCountryNameButton={true}
          containerButtonStyle={{
            width: 50,
            marginTop: "auto",
            marginBottom: "auto",
          }}
          placeholder={null}
          withEmoji
          withFlag
        />
      )}

      <TextInput
        render={(props) => (
          <MaskedInput
            {...props}
            refInput={phoneRef}
            mask={mask}
            onChangeText={(_, extracted) => setExtracted(extracted)}
          />
        )}
        {...props}
        keyboardType="phone-pad"
        style={[{ flex: 1 }, props.style ? props.style : {}]}
      />
    </View>
  );
};

export default PaperPhoneInput;
