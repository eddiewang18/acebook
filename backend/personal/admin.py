from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from .models import (
    InterestGroup,
    InterestTag,
    Profile,
    ProfileInterestTag,
    ProfilePhoto,
)

User = get_user_model()


@admin.register(InterestGroup)
class InterestGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    ordering = ('id',)


@admin.register(InterestTag)
class InterestTagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'interest_group_id')
    list_filter = ('interest_group_id',)
    search_fields = ('name', 'interest_group_id__name')
    ordering = ('id',)


class ProfileInterestTagInline(admin.TabularInline):
    model = ProfileInterestTag
    extra = 1
    raw_id_fields = ('interest_tag',)


class ProfilePhotoInline(admin.TabularInline):
    model = ProfilePhoto
    extra = 1
    readonly_fields = ('cdatetime', 'mdatetime')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'nickname',
        'user',
        'gender',
        'preferred_gender',
        'preferred_age_min',
        'preferred_age_max',
        'cdatetime',
    )
    list_filter = ('gender', 'preferred_gender')
    search_fields = ('nickname', 'user__email', 'user__username')
    raw_id_fields = ('user',)
    inlines = (ProfileInterestTagInline, ProfilePhotoInline)
    readonly_fields = ('cdatetime', 'mdatetime')
    fieldsets = (
        (None, {'fields': ('user', 'nickname', 'gender', 'birthday', 'bio')}),
        (
            'Preference Settings',
            {
                'fields': (
                    'preferred_gender',
                    'preferred_age_min',
                    'preferred_age_max',
                    'preferred_distance_km',
                )
            },
        ),
        ('Timestamps', {'fields': ('cdatetime', 'mdatetime')}),
    )


@admin.register(ProfileInterestTag)
class ProfileInterestTagAdmin(admin.ModelAdmin):
    list_display = ('id', 'profile', 'interest_tag')
    list_filter = ('interest_tag__interest_group_id',)
    search_fields = ('profile__nickname', 'interest_tag__name')
    raw_id_fields = ('profile', 'interest_tag')


@admin.register(ProfilePhoto)
class ProfilePhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'profile', 'image', 'cdatetime')
    list_filter = ('profile__gender',)
    search_fields = ('profile__nickname',)
    readonly_fields = ('cdatetime', 'mdatetime')
    raw_id_fields = ('profile',)