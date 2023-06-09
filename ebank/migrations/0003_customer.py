# Generated by Django 3.2.18 on 2023-03-31 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ebank', '0002_auto_20230331_1612'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('middle_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('date_of_birth', models.DateField()),
                ('country_of_citizenship', models.CharField(max_length=50)),
                ('ssn', models.CharField(blank=True, max_length=50)),
                ('address', models.CharField(max_length=200)),
                ('passport_scan', models.ImageField(upload_to='passport/')),
                ('utility_bill_scan', models.ImageField(upload_to='utility/')),
            ],
        ),
    ]
