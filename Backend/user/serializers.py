from rest_framework import serializers
from .models import MyUser
import re
from django.contrib.auth import authenticate


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = MyUser
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "phone_number",
            "company_name",
            "rating",
            "num_of_rating",
            "age",
            "gender",
            "linkedin_profile_link",
            "pera_wallet_address",
        ]

    def validate(self, data):

        if data["username"]:
            if MyUser.objects.filter(username=data["username"]).exists():
                raise serializers.ValidationError("Username is taken")

        if data["email"]:
            if MyUser.objects.filter(username=data["email"]).exists():
                raise serializers.ValidationError("email is taken")

        if data["password"]:
            password = data["password"]
            if len(password) < 8:
                raise serializers.ValidationError(
                    "Password length should be Greater than 8"
                )

            if not any(c.isupper() for c in password):
                raise serializers.ValidationError(
                    "Password should contain any one upper case charater"
                )

            if not bool(re.search("[^A-Za-z0-9]", password)):
                raise serializers.ValidationError(
                    "Password should contain any one special charater"
                )

        if data["age"]:
            age = data["age"]
            if not (age <= 80 or age >= 18):
                raise serializers.ValidationError("age must be between 18 and 80")

        return data

    def create(self, validated_data):
        user = MyUser(
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            user_role = "FREELANCER",
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            company_name=validated_data["company_name"],
            rating=validated_data["rating"],
            num_of_rating=validated_data["num_of_rating"],
            age=validated_data["age"],
            gender=validated_data["gender"],
            linkedin_profile_link=validated_data["linkedin_profile_link"],
            pera_wallet_address=validated_data["pera_wallet_address"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return validated_data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("Invalid username or password")
            data["user"] = user
        else:
            raise serializers.ValidationError("Must include both username and password")

        return data


class BountyFreelancerSerializer(serializers.ModelSerializer):

    class Meta:
        model = MyUser
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "rating",
            "age",
            "gender",
            "linkedin_profile_link",
        ]


class RatingSerializer(serializers.Serializer):
    rating = serializers.FloatField()
    user_id = serializers.IntegerField()

    def validate(self, data):
        if data["user_id"]:
            if not MyUser.objects.filter(id=data["user_id"]).exists():
                raise serializers.ValidationError("Invalid User ID")

        return data

    def create(self, validated_data):

        user = MyUser.objects.get(id=validated_data["user_id"])

        user.rating = (
            (user.rating * user.num_of_rating) + validated_data["rating"]
        ) / (user.num_of_rating + 1)

        user.num_of_rating += 1
        user.save()
        return validated_data


class UserDetailSerializer(serializers.Serializer):
    username = serializers.CharField()

    def validate(self, data):
        if data["username"]:
            if not MyUser.objects.filter(username=data["username"]).exists():
                raise serializers.ValidationError("Invalid User ID")
        return data
