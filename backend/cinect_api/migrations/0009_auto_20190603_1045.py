# Generated by Django 2.2.1 on 2019-06-03 10:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cinect_api', '0008_auto_20190530_1344'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='swipedright',
            name='username',
        ),
        migrations.DeleteModel(
            name='GroupUser',
        ),
        migrations.DeleteModel(
            name='SwipedRight',
        ),
        migrations.DeleteModel(
            name='User',
        ),
    ]