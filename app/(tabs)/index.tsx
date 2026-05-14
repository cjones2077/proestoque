import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { PRODUTOS_MOCK, Produto, StatusEstoque } from '../../src/data/mockData';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simula uma requisição de rede
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Cálculos para o Dashboard
  const totalItens = PRODUTOS_MOCK.reduce((acc, curr) => acc + curr.quantidade, 0);
  const totalAlertas = PRODUTOS_MOCK.filter(p => p.status !== 'Normal').length;
  const categoriasUnicas = new Set(PRODUTOS_MOCK.map(p => p.categoria)).size;
  const valorTotal = PRODUTOS_MOCK.reduce((acc, curr) => acc + (curr.preco * curr.quantidade), 0);

  const dataAtual = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date());

  const produtosCriticos = PRODUTOS_MOCK.filter(p => p.status === 'Sem estoque' || p.status === 'Baixo');

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

  const renderCard = (title: string, value: string | number, icon: keyof typeof Ionicons.glyphMap, color: string) => (
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

  const dashboardCards = [
    { title: 'Total de Itens', value: totalItens, icon: 'cube-outline', color: COLORS.primary },
    { title: 'Alertas', value: totalAlertas, icon: 'warning-outline', color: COLORS.warning },
    { title: 'Categorias', value: categoriasUnicas, icon: 'grid-outline', color: COLORS.info },
    { title: 'Valor Total', value: formatCurrency(valorTotal), icon: 'cash-outline', color: COLORS.success },
  ] as const;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Olá, Usuário</Text>
        <Text style={styles.dateText}>{dataAtual}</Text>
      </View>

      <View style={styles.cardsGrid}>
        {dashboardCards.map(card => renderCard(card.title, card.value, card.icon, card.color))}
      </View>

      {produtosCriticos.length > 0 && (
        <View style={styles.alertSection}>
          <Text style={styles.sectionTitle}>Alertas de Estoque Crítico</Text>
          {produtosCriticos.map(produto => (
            <View key={produto.id} style={styles.alertItem}>
              <Ionicons name="warning" size={20} color={COLORS.warning} />
              <Text style={styles.alertItemText}>
                {produto.nome} - <Text style={{ color: getStatusColor(produto.status), fontWeight: '600' }}>{produto.status}</Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, { marginTop: SPACING.lg, marginBottom: SPACING.sm }]}>Produtos Recentes</Text>
    </View>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={PRODUTOS_MOCK.slice(0, 5)} // Mostra apenas os 5 primeiros como recentes
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
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
  greetingContainer: {
    marginBottom: SPACING.lg,
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
