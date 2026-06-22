import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { produtoSchema, ProdutoFormData, CATEGORIAS } from '../schemas/produtoSchema';
import Input from './Input';
import Button from './Button';
import ImagePickerField from './ImagePickerField';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface ProdutoFormProps {
  initialValues?: Partial<ProdutoFormData>;
  onSubmit: (data: ProdutoFormData) => void | Promise<void>;
  buttonTitle: string;
  onDelete?: () => void;
}

export default function ProdutoForm({ initialValues, onSubmit, buttonTitle, onDelete }: ProdutoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: initialValues?.nome || '',
      quantidade: initialValues?.quantidade !== undefined ? initialValues.quantidade : 0,
      quantidadeMinima: initialValues?.quantidadeMinima !== undefined ? initialValues.quantidadeMinima : 0,
      preco: initialValues?.preco !== undefined ? initialValues.preco : 0,
      categoria: initialValues?.categoria || undefined,
      observacao: initialValues?.observacao || '',
      foto: initialValues?.foto || '',
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Foto do Produto */}
      <Controller
        control={control}
        name="foto"
        render={({ field: { value, onChange } }) => (
          <ImagePickerField value={value} onChange={onChange} />
        )}
      />

      {/* Nome do Produto */}
      <Controller
        control={control}
        name="nome"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Nome do Produto"
            placeholder="Ex: Teclado Mecânico"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.nome?.message}
          />
        )}
      />

      {/* Categoria */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.fieldLabel}>Categoria</Text>
        <Controller
          control={control}
          name="categoria"
          render={({ field: { value, onChange } }) => (
            <View>
              <View style={styles.categoriesGrid}>
                {CATEGORIAS.map((cat) => {
                  const isSelected = value === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        isSelected && styles.categoryChipActive,
                      ]}
                      onPress={() => onChange(cat)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && styles.categoryChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.categoria?.message && (
                <Text style={styles.errorText}>{errors.categoria.message}</Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Quantidades em Estoque e Mínima */}
      <View style={styles.row}>
        <View style={styles.flexItem}>
          <Controller
            control={control}
            name="quantidade"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Qtd em Estoque"
                placeholder="Ex: 10"
                keyboardType="number-pad"
                value={value === 0 ? '0' : value.toString()}
                onChangeText={(val) => onChange(val === '' ? 0 : Number(val))}
                onBlur={onBlur}
                error={errors.quantidade?.message}
              />
            )}
          />
        </View>

        <View style={styles.flexItem}>
          <Controller
            control={control}
            name="quantidadeMinima"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Qtd Mínima (Alerta)"
                placeholder="Ex: 2"
                keyboardType="number-pad"
                value={value === 0 ? '0' : value.toString()}
                onChangeText={(val) => onChange(val === '' ? 0 : Number(val))}
                onBlur={onBlur}
                error={errors.quantidadeMinima?.message}
              />
            )}
          />
        </View>
      </View>

      {/* Preço Unitário */}
      <Controller
        control={control}
        name="preco"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Preço Unitário (R$)"
            placeholder="Ex: 99.90"
            keyboardType="decimal-pad"
            value={value === 0 ? '' : value.toString()}
            onChangeText={(val) => onChange(val === '' ? 0 : Number(val))}
            onBlur={onBlur}
            error={errors.preco?.message}
          />
        )}
      />

      {/* Observações */}
      <Controller
        control={control}
        name="observacao"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Observação (Opcional)"
            placeholder="Detalhes adicionais do produto..."
            multiline
            numberOfLines={3}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={styles.multilineInput}
            error={errors.observacao?.message}
          />
        )}
      />

      {/* Botão de Enviar */}
      <Button
        title={buttonTitle}
        onPress={handleSubmit(onSubmit)}
        fullWidth
        loading={isSubmitting}
        style={styles.submitBtn}
      />

      {/* Botão de Excluir */}
      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.7}>
          <Text style={styles.deleteButtonText}>Excluir Produto</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  fieldWrapper: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  flexItem: {
    flex: 1,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingVertical: SPACING.sm,
  },
  submitBtn: {
    marginTop: SPACING.lg,
  },
  deleteButton: {
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.error,
    backgroundColor: 'transparent',
    marginTop: SPACING.md,
  },
  deleteButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.error,
    letterSpacing: 0.3,
  },
});
