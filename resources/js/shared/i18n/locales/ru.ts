export const ru = {
  // Навигация и сайт
  nav_calculator: 'Калькулятор',
  nav_configuration: 'Конфигурация',
  nav_catalog: 'Каталог',
  nav_services: 'Услуги (Матрица)',
  nav_about: 'О компании',
  site_catalog_status: 'Каталог VMS-NC',
  admin_panel: 'Админ-панель',
  api_docs: 'API Docs',
  swagger_api: 'Swagger API',

  // Режимы
  mode_prod_title: 'Переключить в обычный пользовательский режим',
  mode_dev_title: 'Переключить в режим разработчика',

  // Избранное
  favorites_title: 'Избранное',
  favorites_clear: 'Очистить',
  favorites_empty_title: 'Здесь пока пусто',
  favorites_empty_desc: 'Добавляйте понравившиеся материалы в избранное, чтобы быстро вернуться к ним позже.',
  favorites_to_catalog: 'В каталог',
  favorites_remove: 'Удалить',
  favorites_footer: 'VMS-NC PLATFORM • СИСТЕМА ИЗБРАННОГО',

  // Цены и наличие
  price_from: 'Базовая цена от',
  price_on_request: 'Бесплатно / По запросу',
  price_not_specified: 'Цены не заданы',
  price_free: 'Бесплатно',
  stock_in_stock: 'В наличии',
  stock_out_of_stock: 'Нет в наличии',
  stock_left_pcs: 'Остаток: :count шт',
  stock_on_order: 'Под заказ',
  unit_pcs: 'шт.',
  unit_prefix: 'Ед. изм:',

  // Каталог и фильтры
  catalog_hero_badge: 'Каталог продукции',
  catalog_hero_title_1: 'Каталог',
  catalog_hero_title_accent: 'материалов',
  catalog_hero_desc: 'Широкий выбор материалов, декоров и комплектующих. Удобная фильтрация по категориям, брендам, цветам и техническим характеристикам.',
  catalog_all_types: 'Все типы',
  catalog_search_placeholder: 'Поиск по названию, коду, артикулу поставщика...',
  catalog_reset_filters: 'Сбросить фильтры',
  catalog_results_title: 'Результаты',
  catalog_items_count: ':count товаров',
  catalog_loading: 'Загрузка...',
  catalog_not_found: 'Ничего не найдено',
  catalog_card_details: 'Подробнее',
  catalog_default_category: 'Каталог',

  // Карточка товара
  product_back_to_catalog: 'Назад в каталог',
  product_no_photo: 'Нет фото',
  product_sku_prefix: 'Артикул:',
  product_code_prefix: 'Код:',
  product_sku_variant_label: 'Вариант исполнения (SKU):',
  product_commercial_offers: 'Торговые предложения (SKU)',
  product_attributes_title: 'Свойства (EAV)',
  product_attributes_missing: 'Свойства не указаны',

  // Калькулятор
  calc_mode_user: 'Пользовательский',
  calc_mode_manager: 'Менеджерский',
  calc_loading_modules: 'Загрузка модулей',
  calc_loading_step_1: 'Инициализация ядра платформы VMS-NC...',
  calc_loading_step_2: 'Подключение к удаленной базе данных...',
  calc_page_title: 'Онлайн-калькулятор изделий',

  // Матрица услуг
  services_hero_badge: 'Матрица цен',
  services_hero_title: 'Услуги',
  services_hero_accent: 'обработки',
  services_hero_desc: 'Полный прайс-лист и расчётная матрица цен на услуги обработки, вырезов, замера и монтажа в разрезе материалов.',
  services_api_response: 'Ответ от API',
  services_positions_count: ':count позиций',
  services_base_cost_prefix: 'Базовая стоимость (:unit)',
  services_copied: 'Код :slug скопирован',
  services_copy_code: 'Копировать код',

  // Инспектор API
  api_inspector_title: 'Инспектор API запросов',
  api_request_copied: 'URL API запроса скопирован!',
  api_json_copied: 'Тело JSON-ответа скопировано!',
  api_copy_json: 'JSON',
  api_copy_url: 'URL',
} as const;

export type TranslationKey = keyof typeof ru;