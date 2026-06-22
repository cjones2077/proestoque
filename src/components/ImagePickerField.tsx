import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../constants/theme';

interface ImagePickerFieldProps {
  value?: string;
  onChange: (uri: string | undefined) => void;
}

export default function ImagePickerField({ value, onChange }: ImagePickerFieldProps) {
  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível acessar a câmera.');
    }
  };

  const handleGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    }
  };

  const handleSelectOption = () => {
    Alert.alert(
      'Foto do Produto',
      'Escolha como deseja adicionar a foto',
      [
        {
          text: 'Tirar Foto (Câmera)',
          onPress: handleCamera,
        },
        {
          text: 'Escolher da Galeria',
          onPress: handleGallery,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  return (
    <View style={styles.container}>
      {value ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: value }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={18} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.changeButton} onPress={handleSelectOption} activeOpacity={0.7}>
            <Text style={styles.changeButtonText}>Alterar Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.pickerBox} onPress={handleSelectOption} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={32} color={COLORS.primary} />
          <Text style={styles.pickerText}>Adicionar Foto</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  pickerBox: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.primary + '40',
    borderStyle: 'dashed',
    backgroundColor: COLORS.primary + '05',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  previewContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.lg,
    position: 'relative',
    ...SHADOWS.md,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.lg,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.error,
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  changeButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    paddingVertical: 4,
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
});
