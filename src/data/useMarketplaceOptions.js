import { useEffect, useState } from 'react';
import { campusLocationGroups, marketplaceCategoryShortcuts, products } from './products';
import { categories as localCategories } from './categories';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const fallbackCategoryOptions = marketplaceCategoryShortcuts.map((shortcut) => ({
    ...shortcut,
    listingCount: products.filter((product) => product.categorySlugs.includes(shortcut.slug)).length,
}));

const fallbackLocationOptions = campusLocationGroups.map((group) => ({
    ...group,
    locations: group.locations.map((name) => ({ name, group_name: group.name })),
}));

export function useMarketplaceOptions() {
    const [categories, setCategories] = useState(
        isSupabaseConfigured ? [] : fallbackCategoryOptions,
    );
    const [locations, setLocations] = useState(
        isSupabaseConfigured ? [] : fallbackLocationOptions,
    );
    const [loading, setLoading] = useState(isSupabaseConfigured);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!supabase) {
            return undefined;
        }

        let active = true;
        Promise.all([
            supabase.from('categories').select('slug, name, icon, description').eq('is_active', true).order('name'),
            supabase.from('campus_locations').select('name, group_name').eq('is_active', true).order('group_name').order('name'),
            supabase.from('listings').select('category_slug').eq('status', 'available').limit(1000),
        ]).then(([categoryResult, locationResult, listingResult]) => {
            if (!active) {
                return;
            }
            const queryError = [categoryResult, locationResult, listingResult]
                .find((result) => result.error)?.error;
            if (queryError) {
                setError(`Could not load categories and locations: ${queryError.message}`);
            } else {
                const listingCounts = listingResult.data.reduce((counts, listing) => {
                    counts[listing.category_slug] = (counts[listing.category_slug] || 0) + 1;
                    return counts;
                }, {});
                setCategories(categoryResult.data.map((category) => ({
                    ...category,
                    categorySlug: category.slug,
                    listingCount: listingCounts[category.slug] || 0,
                })));
                const groupedLocations = locationResult.data.reduce((groups, location) => {
                    const group = groups.find((item) => item.name === location.group_name);
                    if (group) {
                        group.locations.push(location);
                    } else {
                        groups.push({ name: location.group_name, locations: [location] });
                    }
                    return groups;
                }, []);
                setLocations(groupedLocations);
            }
            setLoading(false);
        }).catch((queryError) => {
            if (!active) {
                return;
            }
            setError(`Could not load categories and locations: ${queryError.message}`);
            setLoading(false);
        });

        return () => {
            active = false;
        };
    }, []);

    return {
        categories,
        locations,
        loading,
        error,
        localCategories,
    };
}
