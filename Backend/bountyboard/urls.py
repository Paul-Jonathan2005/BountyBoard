"""
URL configuration for bountyboard project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from user.views import RegisterPerson, LoginPerson, LogoutPerson
from bounties.views import (
    bounty_types,
    get_bounties,
    request_bounty,
    get_freelancer_bounties,
    Bounty,
    get_client_bounties,
    get_bounties_request,
)
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("register/", RegisterPerson.as_view()),
    path("login/", LoginPerson.as_view()),
    path("logout/", LogoutPerson.as_view()),
    path("get-bounty-types/", bounty_types),
    path("get-bounty-types/<str:task_type_value>/get-bounties", get_bounties),
    path("request-bounty/", request_bounty),
    path("get-freelancer-bounties/<int:freelancer_id>", get_freelancer_bounties),
    path("create-bounty/", Bounty.as_view()),
    path("get-client-bounties/<int:client_id>", get_client_bounties),
    path("get-client-bounty/<int:bounty_id>/get-requests", get_bounties_request),
]
