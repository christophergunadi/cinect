# Generated by Django 2.2.1 on 2019-06-13 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cinect_api', '0022_auto_20190613_0936'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userrating',
            name='comment',
            field=models.CharField(max_length=60),
        ),
    ]
