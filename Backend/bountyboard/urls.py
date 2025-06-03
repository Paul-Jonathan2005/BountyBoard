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
from user.views import (
    RegisterPerson,
    LoginPerson,
    LogoutPerson,
    freelancer_rating,
    user_detail,
)
from bounties.views import (
    bounty_types,
    get_bounties,
    request_bounty,
    get_freelancer_bounties,
    Bounty,
    get_client_bounties,
    get_bounties_request,
    accept_bounty_request,
    submit_bounty,
    transfer_amount,
    message,
    get_bounties_details,
    accept_submission_link,
    transfer_amount,
    get_freelancer_requested_bounties,
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
    path(
        "get-freelancer-bounties/<int:freelancer_id>/<str:bounty_type>",
        get_freelancer_bounties,
    ),
    path("create-bounty/", Bounty.as_view()),
    path("get-client-bounties/<int:client_id>/<str:bounty_type>", get_client_bounties),
    path("get-client-bounty/<int:bounty_id>/get-requests", get_bounties_request),
    path("accept-bounty-request/", accept_bounty_request.as_view()),
    path("submit-bounty/<int:bounty_id>", submit_bounty),
    path("transfer-amount/<int:bounty_id>", transfer_amount),
    path("message/", message.as_view()),
    path("message/<int:bounty_id>", message.as_view()),
    path("rating/", freelancer_rating),
    path("get-user-details/<str:username>", user_detail),
    path(
        "get-bounty-details/<int:bounty_id>/<int:freelancer_id>", get_bounties_details
    ),
    path("accept-submission-link/<int:bounty_id>", accept_submission_link),
    path("transfer-amount/<int:bounty_id>", transfer_amount),
    path("get-requested-bounties/<int:freelancer_id>", get_freelancer_requested_bounties),
]
