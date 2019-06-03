# Generated by Django 2.2.1 on 2019-06-03 10:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cinect_api', '0009_auto_20190603_1045'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('email', models.EmailField(max_length=254, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'users',
            },
        ),
        migrations.CreateModel(
            name='SwipedRight',
            fields=[
                ('swiperightid', models.AutoField(primary_key=True, serialize=False)),
                ('movieid', models.CharField(max_length=10)),
                ('useremail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cinect_api.User')),
            ],
            options={
                'db_table': 'swipedright',
            },
        ),
        migrations.CreateModel(
            name='GroupUser',
            fields=[
                ('groupuserid', models.AutoField(primary_key=True, serialize=False)),
                ('groupid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cinect_api.Group')),
                ('useremail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cinect_api.User')),
            ],
            options={
                'db_table': 'groupusers',
            },
        ),
    ]
