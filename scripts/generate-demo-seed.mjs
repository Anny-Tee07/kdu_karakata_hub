import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { categories } from '../src/data/categories.js';
import {
    campusLocationGroups,
    getProductPrice,
    products,
} from '../src/data/products.js';

const quote = (value) => `'${String(value ?? '').replace(/'/g, "''")}'`;
const uuidFor = (value) => {
    const hex = createHash('sha256').update(value).digest('hex').slice(0, 32).split('');
    hex[12] = '5';
    hex[16] = (Number.parseInt(hex[16], 16) & 0x3 | 0x8).toString(16);
    const raw = hex.join('');
    return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
};

const statements = [
    '-- Generated from src/data/categories.js and src/data/demoListings.js. Do not edit by hand.',
    "select set_config('request.jwt.claim.role', 'service_role', true);",
    `insert into public.categories (slug, name, icon, description) values\n${categories.map((category) => (
        `    (${quote(category.slug)}, ${quote(category.name)}, ${quote(category.icon)}, ${quote(category.description)})`
    )).join(',\n')}\non conflict (slug) do nothing;`,
    `insert into public.campus_locations (name, group_name) values\n${campusLocationGroups.flatMap((group) => (
        group.locations.map((location) => `    (${quote(location)}, ${quote(group.name)})`)
    )).join(',\n')}\non conflict (name) do nothing;`,
];

const listingRows = products.map((product) => {
    const category = categories.find((item) => product.categorySlugs.includes(item.slug));
    if (!category || !product.location || !getProductPrice(product)) {
        throw new Error(`Cannot seed invalid demonstration listing: ${product.name}`);
    }
    return `    (${quote(uuidFor(product.id))}::uuid, ${quote(category.slug)}, ${quote(product.location)}, ${quote(product.name)}, ${quote(product.description)}, ${getProductPrice(product)}, ${quote(product.image)}, ${quote(product.vendor)}, ${quote(product.whatsappNumber || '')}, true, 'available')`;
});

if (products.length !== 100 || new Set(products.map((product) => product.name)).size !== 100) {
    throw new Error(`Expected exactly 100 unique demo listings; found ${products.length}.`);
}

statements.push(
    `insert into public.listings (id, category_slug, location_name, name, description, price, image_url, seller_name, whatsapp_number, is_demo, status) values\n${listingRows.join(',\n')}\non conflict (id) do nothing;`,
    "select set_config('request.jwt.claim.role', '', true);",
);

await writeFile(
    new URL('../supabase/migrations/20261020140000_seed_demo_catalog.sql', import.meta.url),
    `${statements.join('\n\n')}\n`,
);
