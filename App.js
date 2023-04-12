/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ToastAndroid,
  Share,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';

import {Colors} from 'react-native/Libraries/NewAppScreen';

let cameraRef;
const {width} = Dimensions.get('window');
// const offset = width / 20;

const App: () => Node = () => {
  const [blocks, seteBlocks] = useState([]);
  const [modal, setModal] = useState(false);

  let text = '';
  blocks.forEach((block, i) => {
    text += block.value + '\n';
  });

  const copy = () => {
    Clipboard.setString(text);
    ToastAndroid.show(
      'Text copied to Clipboard',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  };

  const share = () => {
    Share.share({message: text});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <RNCamera
        ref={ref => {
          cameraRef = ref;
        }}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        // onGoogleVisionBarcodesDetected={({barcodes}) => {
        //   console.log(barcodes);
        // }}
        // onFacesDetected={faces => console.log(faces)}
        onTextRecognized={({textBlocks}) => {
          if (!modal) {
            seteBlocks(textBlocks);
          }
        }}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => setModal(true)} style={styles.capture}>
          <Icon name="eye" size={20} color={Colors.dark} />
          <Text style={styles.scanText}>VIEW</Text>
        </TouchableOpacity>
      </View>
      {!modal && blocks.map((block, index) => (
          <View
            key={index.toString()}
            style={{
              position: 'absolute',
              left: block.bounds.origin.x,// - offset,
              top: block.bounds.origin.y,
              width: block.bounds.size.width * 1.2,
              height: block.bounds.size.height * 0.9,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.6)'
            }}
          >
            <Text
              style={{
                flexWrap: 'wrap',
                fontSize: block.bounds.size.height / block.components.length / 2,
            }}>
              {block.value}
            </Text>
          </View>
      ))}
      <Modal visible={modal} onRequestClose={() => setModal(false)} transparent>
        <View style={styles.backdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.endROw}>
              <Icon
                name="circle-with-cross"
                color={Colors.dark}
                size={32}
                onPress={() => setModal(false)}
              />
            </View>
            <ScrollView>
              <Text style={styles.previewText}>{text}</Text>
            </ScrollView>
            <View style={styles.bottomRow}>
              <TouchableOpacity style={styles.button} onPress={share}>
                <Icon name="share" size={24} />
                <Text style={styles.buttonLabel}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={copy}>
                <FeatherIcon name="copy" size={26} />
                <Text style={styles.buttonLabel}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  buttonRow: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scanText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalWindow: {
    flex: 1,
    marginVertical: '20%',
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  previewText: {
    flexWrap: 'wrap',
    margin: 10,
    color: '#1292B4',
  },
  endROw: {
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bottomRow: {
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffc107',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});

export default App;
