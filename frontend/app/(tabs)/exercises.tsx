import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, getDifficultyColor, getDomainColor } from '../../src/constants/theme';
import { getExercises, getDomains, getDifficulties } from '../../src/services/api';
import { ExerciseCard } from '../../src/components/ExerciseCard';
import { getCompletedExercises, getCompletionStats } from '../../src/utils/completionStorage';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [difficulties, setDifficulties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [completionStats, setCompletionStats] = useState({ percentComplete: 0, totalCompleted: 0 });

  useEffect(() => {
    loadInitialData();
  }, []);

  // Refresh completion status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCompletionStatus();
    }, [])
  );

  useEffect(() => {
    loadExercises();
  }, [selectedDomain, selectedDifficulty, searchQuery]);

  const loadCompletionStatus = async () => {
    const completed = await getCompletedExercises();
    const stats = await getCompletionStats();
    setCompletedExercises(completed);
    setCompletionStats(stats);
  };

  const loadInitialData = async () => {
    try {
      const [domainsData, difficultiesData] = await Promise.all([
        getDomains(),
        getDifficulties(),
      ]);
      setDomains(domainsData.domains);
      setDifficulties(difficultiesData.difficulties);
      await loadExercises();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExercises = async () => {
    try {
      const data = await getExercises({
        domain: selectedDomain || undefined,
        difficulty: selectedDifficulty || undefined,
        search: searchQuery || undefined,
        limit: 50,
      });
      setExercises(data.exercises);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const clearFilters = () => {
    setSelectedDomain(null);
    setSelectedDifficulty(null);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Exercise Library</Text>
        <Text style={styles.subtitle}>{exercises.length} exercises available</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {/* Domain Filters */}
          {domains.map((domain) => (
            <TouchableOpacity
              key={domain.name}
              style={[
                styles.filterChip,
                selectedDomain === domain.name && {
                  backgroundColor: getDomainColor(domain.name),
                },
              ]}
              onPress={() => setSelectedDomain(selectedDomain === domain.name ? null : domain.name)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedDomain === domain.name && { color: COLORS.text },
                ]}
                numberOfLines={1}
              >
                {domain.name.split(' & ')[0]}
              </Text>
              <Text style={styles.filterChipCount}>{domain.count}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Difficulty Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {difficulties.map((diff) => (
            <TouchableOpacity
              key={diff.name}
              style={[
                styles.filterChip,
                selectedDifficulty === diff.name && {
                  backgroundColor: getDifficultyColor(diff.name),
                },
              ]}
              onPress={() => setSelectedDifficulty(selectedDifficulty === diff.name ? null : diff.name)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedDifficulty === diff.name && { color: COLORS.text },
                ]}
              >
                {diff.name}
              </Text>
              <Text style={styles.filterChipCount}>{diff.count}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {(selectedDomain || selectedDifficulty || searchQuery) && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Ionicons name="refresh" size={16} color={COLORS.primary} />
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Exercise List */}
      <View style={styles.listContainer}>
        <FlashList
          data={exercises}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => {
                router.push({
                  pathname: '/practice',
                  params: { exerciseId: item.id },
                });
              }}
            />
          )}
          estimatedItemSize={180}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No exercises found</Text>
              <Text style={styles.emptyText}>Try adjusting your filters</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.hero,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  filtersSection: {
    marginBottom: SPACING.sm,
  },
  filtersScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
    gap: SPACING.xs,
  },
  filterChipText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterChipCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: SPACING.lg,
    gap: SPACING.xs,
  },
  clearButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
