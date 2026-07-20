<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('showers_rooms', function (Blueprint $table) {
      $table->id();

      $table->jsonb('name');

      $table->jsonb('points')->default('[]');

      $table->boolean('is_active')->default(true);
      $table->integer('sort_order')->default(0);
      $table->timestamps();

      $table->index(['is_active']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('showers_rooms');
  }
};
