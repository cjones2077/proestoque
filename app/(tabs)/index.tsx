// app/(tabs)/index.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useProducts } from '../../src/contexts/ProductsContext';
import { Produto } from '../../src/schemas/produtoSchema';
import LoadingView from '../../src/components/LoadingView';

export default function Home() {
  const { user } = useAuth();
  const { produtos, isLoading, loadProducts } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, [loadProducts]);

  if (isLoading && !refreshing) {
    return <LoadingView message="Carregando dashboard..." />;
  }

  // ─── Cálculos derivados da lista real de produtos ─────────────────
  const totalProdutos = produtos.length;
  const totalAlertas = produtos.filter(
    (p) => p.status === 'Baixo' || p.status === 'Sem estoque'
  ).length;
  const categoriasUnicas = new Set(produtos.map((p) => p.categoriaId)).size;
  const valorTotal = produtos.reduce(
    (acc, curr) => acc + curr.preco * curr.quantidade,
    0
  );
  const produtosCriticos = produtos.filter(
    (p) => p.status === 'Sem estoque' || p.status === 'Baixo'
  );

  const dataAtual = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(
    new Date()
  );

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const dashboardCards = [
    { title: 'Total de Produtos', value: totalProdutos, icon: 'cube-outline' as const, color: COLORS.primary },
    { title: 'Alertas', value: totalAlertas, icon: 'warning-outline' as const, color: COLORS.warning },
    { title: 'Categorias', value: categoriasUnicas, icon: 'grid-outline' as const, color: COLORS.info },
    { title: 'Valor Total', value: formatCurrency(valorTotal), icon: 'cash-outline' as const, color: COLORS.success },
  ];

  const renderCard = (
    title: string,
    value: string | number,
    icon: keyof typeof Ionicons.glyphMap,
    color: string
  ) => (
    <View style={styles.card} key={title}>
      <View style={[styles.cardIconBox, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );

  const renderHeader = () => {
    const firstLetter = user?.nome ? user.nome.charAt(0).toUpperCase() : 'U';
    return (
      <View style={styles.headerContainer}>
        {/* Saudação */}
        <View style={styles.headerRow}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              {getGreeting()}, {user?.nome || 'Usuário'}
            </Text>
            <Text style={styles.dateText}>{dataAtual}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>
        </View>

        {/* Cards de métricas */}
        <View style={styles.cardsGrid}>
          {dashboardCards.map((card) =>
            renderCard(card.title, card.value, card.icon, card.color)
          )}
        </View>

        {/* Alertas críticos */}
        {produtosCriticos.length > 0 && (
          <View style={styles.alertSection}>
            <Text style={styles.sectionTitle}>Alertas de Estoque Crítico</Text>
            {produtosCriticos.map((produto) => (
              <View key={produto.id} style={styles.alertItem}>
                <Ionicons name="warning" size={20} color={COLORS.warning} />
                <Text style={styles.alertItemText}>
                  {produto.nome} —{' '}
                  <Text
                    style={{ color: getStatusColor(produto.status), fontWeight: '600' }}
                  >
                    {produto.status}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.sectionTitle, { marginTop: SPACING.lg, marginBottom: SPACING.sm }]}>
          Produtos Recentes
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Produto }) => (
    <View style={styles.produtoItem}>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoCategoria}>{item.categoriaNome}</Text>
        <Text style={styles.produtoPreco}>
          {formatCurrency(item.preco)} · Qtd: {item.quantidade} {item.unidade}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
        <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={produtos.slice(0, 5)} // Os 5 mais recentes
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
  },
  headerContainer: {
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  greetingContainer: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  greetingText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  dateText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textTransform: 'capitalize',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  avatarText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  alertSection: {
    backgroundColor: COLORS.errorLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  alertItemText: {
    marginLeft: SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
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
});
