@php
  use Valerie\Box\IndustryShowers\Support\PdfReport;

  $company = $company ?? PdfReport::company();
@endphp

<div class="manager-card-light">
  <div class="manager-info">
    <div class="manager-post-light">{{ __('Company Contacts') }}</div>
    <div class="manager-name-light">{{ $company['name'] }}</div>

    <ul class="manager-contacts-list-light">
      @if ($company['phone'])
        <li>
          <span>{{ __('Phone:') }}</span>
          <a href="tel:{{ $company['phone_clean'] }}">{{ $company['phone'] }}</a>
        </li>
      @endif
      @if ($company['email'])
        <li>
          <span>{{ __('Email:') }}</span>
          <a href="mailto:{{ $company['email'] }}">{{ $company['email'] }}</a>
        </li>
      @endif
      @if ($company['address'])
        <li>
          <span>{{ __('Office address:') }}</span>
          {{ __($company['address']) }}
        </li>
      @endif
      @if ($company['website'])
        <li>
          <span>{{ __('Website:') }}</span>
          <a href="https://{{ $company['website'] }}" target="_blank">{{ $company['website'] }}</a>
        </li>
      @endif
      @if ($company['messengers'])
        <li>
          <span>{{ __('Support:') }}</span>
          {{ __($company['messengers']) }}
        </li>
      @endif
      @if ($company['working_hours'])
        <li>
          <span>{{ __('Working Hours:') }}</span>
          {{ __($company['working_hours']) }}
        </li>
      @endif
    </ul>
  </div>
</div>
