import { TranslationKey } from './ru';

export const en: Record<TranslationKey, string> = {
  // Navigation & site
  nav_calculator: 'Calculator',
  nav_configuration: 'Configuration',
  nav_catalog: 'Catalog',
  nav_services: 'Services (Matrix)',
  nav_about: 'About Us',
  site_catalog_status: 'VMS-NC Catalog',
  admin_panel: 'Admin Panel',
  api_docs: 'API Docs',
  swagger_api: 'Swagger API',

  // Modes
  mode_prod_title: 'Switch to regular user mode',
  mode_dev_title: 'Switch to developer mode',

  // Favorites
  favorites_title: 'Favorites',
  favorites_clear: 'Clear',
  favorites_empty_title: 'It is empty here',
  favorites_empty_desc: 'Add favorite materials to favorites to quickly return to them later.',
  favorites_to_catalog: 'To Catalog',
  favorites_remove: 'Remove',
  favorites_footer: 'VMS-NC PLATFORM • FAVORITES SYSTEM',

  // Prices & Stock
  price_from: 'Base price from',
  price_on_request: 'Free / On request',
  price_not_specified: 'Prices not set',
  price_free: 'Free',
  stock_in_stock: 'In stock',
  stock_out_of_stock: 'Out of stock',
  stock_left_pcs: 'In stock: :count pcs',
  stock_on_order: 'To order',
  unit_pcs: 'pcs.',
  unit_prefix: 'Unit:',

  // Catalog & Filters
  catalog_hero_badge: 'Product Catalog',
  catalog_hero_title_1: 'Materials',
  catalog_hero_title_accent: 'Catalog',
  catalog_hero_desc: 'Wide selection of materials, decors and components. Convenient filtering by categories, brands, colors and technical specifications.',
  catalog_all_types: 'All types',
  catalog_search_placeholder: 'Search by name, code, SKU...',
  catalog_reset_filters: 'Reset filters',
  catalog_results_title: 'Results',
  catalog_items_count: ':count products',
  catalog_loading: 'Loading...',
  catalog_not_found: 'Nothing found',
  catalog_card_details: 'Details',
  catalog_default_category: 'Catalog',

  // Product Page
  product_back_to_catalog: 'Back to catalog',
  product_no_photo: 'No photo',
  product_sku_prefix: 'SKU:',
  product_code_prefix: 'Code:',
  product_sku_variant_label: 'Variant (SKU):',
  product_commercial_offers: 'Commercial Offers (SKU)',
  product_attributes_title: 'Technical Specifications (EAV)',
  product_attributes_missing: 'Specifications not specified',

  // Calculator
  calc_mode_user: 'User Mode',
  calc_mode_manager: 'Manager Mode',
  calc_loading_modules: 'Loading modules',
  calc_loading_step_1: 'Initializing VMS-NC core platform...',
  calc_loading_step_2: 'Connecting to remote database...',
  calc_page_title: 'Online Product Configurator',

  // Services Matrix
  services_hero_badge: 'Pricing Matrix',
  services_hero_title: 'Processing',
  services_hero_accent: 'Services',
  services_hero_desc: 'Full price list and calculation matrix for cutting, edge processing, measuring and installation services.',
  services_api_response: 'API Response',
  services_positions_count: ':count positions',
  services_base_cost_prefix: 'Base cost (:unit)',
  services_copied: 'Code :slug copied',
  services_copy_code: 'Copy code',

  // API Inspector
  api_inspector_title: 'API Request Inspector',
  api_request_copied: 'API URL copied!',
  api_json_copied: 'JSON response body copied!',
  api_copy_json: 'JSON',
  api_copy_url: 'URL',
};