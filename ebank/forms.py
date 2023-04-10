from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import gettext_lazy as _
from .models import Customer

class SignUpForm(UserCreationForm):
    date_of_birth = forms.DateField()

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'date_of_birth')


class RememberMeAuthenticationForm(AuthenticationForm):
    remember_me = forms.BooleanField(
        required=False,
        initial=True,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        label=_('Remember me')
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'remember_me' in self.data:
            self.fields['remember_me'].initial = self.data['remember_me']


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = [
            'first_name',
            'middle_name',
            'last_name',
            'date_of_birth',
            'ssn',
            'citizenship',
            'country_of_residence',
            'address',
            'state',
            'zipcode',
            'passport',
            'utility_bill'
        ]
