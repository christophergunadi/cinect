# Generated by Django 2.2.1 on 2019-05-30 11:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cinect_api', '0005_auto_20190530_1102'),
    ]

    operations = [
        migrations.AlterField(
            model_name='swipedright',
            name='username',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cinect_api.User'),
        ),
    ]
