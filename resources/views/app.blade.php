<!-- resources/views/app.blade.php -->
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">

  @include('partials.seo', ['seo' => $seo ?? []])

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
    rel="stylesheet">

  @routes

  @viteReactRefresh
  @vite(['resources/css/app.css', 'resources/js/app.tsx'])
  @inertiaHead

  <script>
    window.f = {
      MAIN_PHP_PATH: '/',
      DEAL_URI_SHARED: '',

      URI_IMG: '/widget/images/',

      gI: function(id) { return document.getElementById(id); },
      gV: function(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
      },
      getDataAsAssoc: function(id) {
        var el = document.getElementById(id);
        if (!el || !el.value) return {};
        try { return JSON.parse(el.value); } catch (e) { return {}; }
      },
      getSetting: function(key, defaultValue) {
        return defaultValue || null;
      }
    };
    var f = window.f;
  </script>
</head>
<body class="font-sans antialiased bg-bg-light text-tx-primary overflow-x-hidden">
@inertia
<div class="dummy-calc-anchor">dummy-calc-anchor</div>
</body>
</html>
