# Generated by Django 2.2.1 on 2019-06-07 11:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cinect_api', '0018_movie'),
    ]

    operations = [
        migrations.AlterField(
            model_name='swipedright',
            name='movieid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cinect_api.Movie'),
        ),
        migrations.AlterField(
            model_name='userwatched',
            name='movieid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cinect_api.Movie'),
        ),
    ]
