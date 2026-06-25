// app/(tabs)/produtos/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProducts } from '../../../src/contexts/ProductsContext';
import { useCategorias } from '../../../src/hooks/useCategorias';
import { Produto } from '../../../src/schemas/produtoSchema';
import { SkeletonProductList } from '../../../src/components/SkeletonProductCard';
import ErrorView from '../../../src/components/ErrorView';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../../src/constants/theme';

export default function ProdutosScreen() {
  const { produtos, isLoading, error, loadProducts } = useProducts();
  const { categorias } = useCategorias();
  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh — sincroniza com a API
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, [loadProducts]);

  // Filtra por texto e categoria selecionada
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const matchText =
        produto.nome.toLowerCase().includes(searchText.toLowerCase()) ||
        produto.categoriaNome.toLowerCase().includes(searchText.toLowerCase());
      const matchCategoria = selectedCategoriaId
        ? produto.categoriaId === selectedCategoriaId
        : true;
      return matchText && matchCategoria;
    });
  }, [produtos, searchText, selectedCategoriaId]);

  const getStatusColor = (status: Produto['status']) => {
    switch (status) {
      case 'Normal': return COLORS.success;
      case 'Baixo': return COLORS.warning;
      case 'Sem estoque': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.placeholder} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produtos..."
              placeholderTextColor={COLORS.placeholder}
              editable={false}
            />
          </View>
          <View style={styles.chipsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              <View style={[styles.chip, styles.chipActive]}>
                <Text style={[styles.chipText, styles.chipTextActive]}>Todas</Text>
              </View>
            </ScrollView>
          </View>
        </View>
        <SkeletonProductList />
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return <ErrorView message={error} onRetry={loadProducts} />;
  }

  // ─── Renderização da lista ─────────────────────────────────────────
  const renderItem = ({ item }: { item: Produto }) => (
    <TouchableOpacity
      style={styles.produtoItem}
      onPress={() => router.push(`/produtos/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.produtoImageWrapper}>
        <View style={styles.fallbackIconBox}>
          <Ionicons name="cube-outline" size={24} color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.produtoCategoria}>{item.categoriaNome}</Text>
        <Text style={styles.produtoPreco}>
          {formatCurrency(item.preco)} · {item.quantidade} {item.unidade}
        </Text>
      </View>

      <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
        <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={COLORS.placeholder} />
      <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
      <Text style={styles.emptySubtext}>
        Tente ajustar sua busca ou toque no botão '+' para adicionar.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho com busca e filtros de categoria */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.placeholder} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor={COLORS.placeholder}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.placeholder} />
            </TouchableOpacity>
          )}
        </View>

        {/* Chips de categoria — vindos da API */}
        <View style={styles.chipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            <TouchableOpacity
              style={[styles.chip, selectedCategoriaId === null && styles.chipActive]}
              onPress={() => setSelectedCategoriaId(null)}
            >
              <Text style={[styles.chipText, selectedCategoriaId === null && styles.chipTextActive]}>
                Todas
              </Text>
            </TouchableOpacity>

            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selectedCategoriaId === cat.id && styles.chipActive]}
                onPress={() =>
                  setSelectedCategoriaId(cat.id === selectedCategoriaId ? null : cat.id)
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategoriaId === cat.id && styles.chipTextActive,
                  ]}
                >
                  {cat.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* FAB — Adicionar Produto */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/produtos/novo')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    height: 44,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  chipsContainer: {
    marginHorizontal: -SPACING.md,
  },
  chipsScroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
    paddingBottom: 90,
  },
  produtoItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  },
  produtoImageWrapper: {
    marginRight: SPACING.md,
  },
  fallbackIconBox: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  produtoCategoria: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  produtoPreco: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
});
