from rest_framework import serializers
from .models import InterestGroup, InterestTag

class InterestTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestTag
        fields = ['id', 'name']

class InterestGroupSerializer(serializers.ModelSerializer):
    subcategories = InterestTagSerializer(many=True, source='interesttag_set')
    
    class Meta:
        model = InterestGroup
        fields = ['id', 'name', 'subcategories']