# Generated by Django 2.2.1 on 2019-06-04 13:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cinect_api', '0014_userwatched'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='swipedright',
            unique_together={('email', 'movieid')},
        ),
    ]
