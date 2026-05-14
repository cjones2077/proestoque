import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRODUTOS_MOCK, Produto, StatusEstoque } from '../../src/data/mockData';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';

export default function ProdutosScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);

  // Extrair categorias únicas do mock
  const categorias = useMemo(() => {
    const cats = PRODUTOS_MOCK.map(p => p.categoria);
    return Array.from(new Set(cats));
  }, []);

  // Filtrar produtos com base no texto E na categoria, usando useMemo para otimização
  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter(produto => {
      const matchText = produto.nome.toLowerCase().includes(searchText.toLowerCase()) || 
                        produto.categoria.toLowerCase().includes(searchText.toLowerCase());
      
      const matchCategoria = selectedCategoria ? produto.categoria === selectedCategoria : true;
      
      return matchText && matchCategoria;
    });
  }, [searchText, selectedCategoria]);

  const getStatusColor = (status: StatusEstoque) => {
    switch (status) {
      case 'Normal': return COLORS.success;
      case 'Baixo': return COLORS.warning;
      case 'Sem estoque': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const renderItem = ({ item }: { item: Produto }) => (
    <View style={styles.produtoItem}>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoCategoria}>{item.categoria}</Text>
        <Text style={styles.produtoPreco}>{formatCurrency(item.preco)} - Qtd: {item.quantidade}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
        <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={COLORS.placeholder} />
      <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
      <Text style={styles.emptySubtext}>Tente ajustar sua busca ou filtro de categoria.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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

        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            <TouchableOpacity
              style={[
                styles.chip,
                selectedCategoria === null && styles.chipActive
              ]}
              onPress={() => setSelectedCategoria(null)}
            >
              <Text style={[
                styles.chipText,
                selectedCategoria === null && styles.chipTextActive
              ]}>Todas</Text>
            </TouchableOpacity>
            
            {categorias.map(categoria => (
              <TouchableOpacity
                key={categoria}
                style={[
                  styles.chip,
                  selectedCategoria === categoria && styles.chipActive
                ]}
                onPress={() => setSelectedCategoria(categoria === selectedCategoria ? null : categoria)}
              >
                <Text style={[
                  styles.chipText,
                  selectedCategoria === categoria && styles.chipTextActive
                ]}>{categoria}</Text>
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
      />
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
  },
});
