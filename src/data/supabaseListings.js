import { categories } from './categories';
import { marketplaceCategoryShortcuts } from './products';

export function mapSupabaseListing(row, availableCategories = []) {
    const category = availableCategories.find((item) => item.slug === row.category_slug)
        || categories.find((item) => item.slug === row.category_slug);
    const shortcutSlugs = marketplaceCategoryShortcuts
        .filter((shortcut) => shortcut.categorySlug === row.category_slug)
        .map((shortcut) => shortcut.slug);

    return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: `₦${Number(row.price).toLocaleString('en-NG')}`,
        priceValue: Number(row.price),
        vendor: row.seller_name,
        rating: '',
        location: row.location_name,
        image: row.image_url || '',
        whatsappNumber: row.whatsapp_number || '',
        action: 'Details',
        actionStyle: '',
        isDemo: row.is_demo,
        status: row.status,
        categorySlug: row.category_slug,
        categoryNames: [row.categories?.name || category?.name || row.category_slug],
        categorySlugs: [row.category_slug, ...shortcutSlugs],
        ownerId: row.owner_id,
        createdAt: Date.parse(row.created_at) || 0,
    };
}
