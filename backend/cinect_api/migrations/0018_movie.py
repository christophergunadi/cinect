# Generated by Django 2.2.1 on 2019-06-07 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cinect_api', '0017_user_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('movieid', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('movietitle', models.CharField(max_length=100)),
                ('posterpath', models.CharField(max_length=200)),
                ('synopsis', models.CharField(max_length=600)),
                ('rating', models.IntegerField()),
            ],
            options={
                'db_table': 'movies',
            },
        ),
    ]
