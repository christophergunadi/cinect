# Generated by Django 2.2.1 on 2019-05-30 11:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cinect_api', '0004_auto_20190530_1057'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Groups',
            new_name='Group',
        ),
        migrations.RenameModel(
            old_name='GroupUsers',
            new_name='GroupUser',
        ),
        migrations.RenameModel(
            old_name='Users',
            new_name='User',
        ),
    ]
