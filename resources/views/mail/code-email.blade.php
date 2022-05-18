<h2>Welcome {{ $data['name'] }}, thank you for joining us.</h2> <br>
<p>Please enter the code below to activate your account:</p>
<p>Code:</p>
<p>{{ $data['code'] }}</p>

{{-- @component('mail::message')
# Welcome, thank you for joining us.

Please enter the code below to activate your account:

Code:
{{ $code }}

Thanks,<br>
Task Organizer team.
@endcomponent --}}
