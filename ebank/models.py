from django.db import models
from django.contrib.auth.models import User

class Customer(models.Model):
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    ssn = models.CharField(max_length=50, blank=True)
    citizenship = models.CharField(max_length=255)
    country_of_residence = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=10)
    passport = models.ImageField(upload_to='passports/')
    utility_bill = models.ImageField(upload_to='utility_bills/')

    def __str__(self):
        return f'{self.first_name} {self.last_name}'




class BankAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bank_accounts')
    account_number = models.CharField(max_length=20)
    currency = models.CharField(max_length=3)
    balance = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.user.username}'s {self.currency} Account ({self.account_number})"

    def deposit(self, amount):
        self.balance += amount
        self.save()
        Transaction.objects.create(account=self, transaction_type='deposit', amount=amount)

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError('Insufficient balance')
        self.balance -= amount
        self.save()
        Transaction.objects.create(account=self, transaction_type='withdrawal', amount=amount)

class Transaction(models.Model):
    account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10)
    remark=models.CharField(max_length=300)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.transaction_type.capitalize()} of {self.amount} on {self.timestamp} for {self.account.user.username}'s {self.account.currency} Account ({self.account.account_number})"
