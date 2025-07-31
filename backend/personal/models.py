from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class InterestGroup(models.Model):
    name = models.CharField(max_length = 255 , db_column='name',unique=True)

    class Meta:
        db_table = "interest_group"

    def __str__(self):
        return self.name  # 這會在下拉選單中顯示 name 字段


class InterestTag(models.Model):
    interest_group_id = models.ForeignKey(InterestGroup, on_delete=models.CASCADE,db_column='interest_group_id')
    name = models.CharField(max_length=30, unique=True, db_column="name")

    class Meta:
        db_table = "interest_tag"
        unique_together = (('interest_group_id', 'name'),)

    def __str__(self):
        return self.name


class Profile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        db_column='user_id'
    )

    nickname = models.CharField(
        max_length=30,
        db_column='nickname',
        null=True,
        blank=True
    )

    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        db_column='gender',
        null=True,
        blank=True
    )

    birthday = models.DateField(
        db_column='birthday',
        null=True,
        blank=True
    )

    bio = models.TextField(
        max_length=500,
        db_column='bio',
        blank=True,
        default=''
    )

    interests = models.ManyToManyField(
        InterestTag,
        through='ProfileInterestTag',
        related_name='profiles',
        null=True,
        blank=True
    )

    preferred_gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        db_column='preferred_gender',
        null=True,
        blank=True
    )

    preferred_age_min = models.PositiveIntegerField(
        db_column='preferred_age_min',
        default=18
    )

    preferred_age_max = models.PositiveIntegerField(
        db_column='preferred_age_max',
        default=40
    )

    preferred_distance_km = models.PositiveIntegerField(
        db_column='preferred_distance_km',
        default=30  # 預設距離 30 公里
    )

    cdatetime = models.DateTimeField(
        auto_now_add=True,
        db_column='cdatetime'
    )

    mdatetime = models.DateTimeField(
        auto_now=True,
        db_column='mdatetime'
    )

    class Meta:
        db_table = 'profile'
        indexes = [
            models.Index(fields=['gender'], name='idx_profile_gender'),
            models.Index(fields=['preferred_gender'], name='idx_prefer_gender'),
        ]

    def __str__(self):
        return f"{self.nickname} ({self.user.email})"

class ProfileInterestTag(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, db_column="profile_id")
    interest_tag = models.ForeignKey(InterestTag, on_delete=models.CASCADE, db_column="interest_tag_id")

    class Meta:
        db_table = "profile_interest_tag"
        unique_together = (("profile", "interest_tag"),)

class ProfilePhoto(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='photos',
        db_column='profile_id'
    )
    image = models.ImageField(upload_to='profile_photos/', db_column='image')

    cdatetime = models.DateTimeField(
        auto_now_add=True,
        db_column='cdatetime'
    )

    mdatetime = models.DateTimeField(
        auto_now=True,
        db_column='mdatetime'
    )

    class Meta:
        db_table = 'profile_photo'
        indexes = [
            models.Index(fields=['profile'], name='idx_photo_profile'),
        ]

    def __str__(self):
        return f"Photo of {self.profile.nickname}"

class Match(models.Model):
    profile1 = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='match_profile_1',
        db_column='profile_1'
    )

    profile2 = models.ForeignKey(  # ← 修正多餘等號
        Profile,
        on_delete=models.CASCADE,
        related_name='match_profile_2',  # ← 建議改為語意清楚的 related_name
        db_column='profile_2'  # ← 修正 column 名稱一致性
    )

    status = models.CharField(
        db_column='status',
        max_length=20,
        null=True,
        blank=True
    )  # 可選值: match / pending / pass

    cdatetime = models.DateTimeField(
        auto_now_add=True,
        db_column='cdatetime'
    )

    mdatetime = models.DateTimeField(
        auto_now=True,
        db_column='mdatetime'
    )

    matchtime = models.DateTimeField(
        db_column='match_time',
        null=True,
        blank=True
    )

    lifttime = models.DateTimeField(
        db_column='lifttime',
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'match'
        constraints = [
            models.UniqueConstraint(
                fields=['profile1', 'profile2'],
                name='unique_match_profiles'
            )
        ]

    def __str__(self):
        return f"Match between {self.profile1.nickname} & {self.profile2.nickname}"
